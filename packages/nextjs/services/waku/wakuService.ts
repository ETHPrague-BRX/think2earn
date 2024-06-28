import { createEncoder as eciesEncoder, createDecoder as eciesDecoder } from "@waku/message-encryption/ecies";
import { DecodedMessage } from "@waku/message-encryption";
import { LightNode, PageDirection, Protocols, createLightNode, waitForRemotePeer } from "@waku/sdk";
import { hexToBytes } from "@waku/utils/bytes";
import { ChatMessage } from "./message";
// import { signUserChatMessage } from "./crypto";
import { wakuPeerExchangeDiscovery } from "@waku/discovery";
import { UseAccountReturnType, Config } from "wagmi";

const PUBSUB_TOPIC = "/waku/2/default-waku/proto";

export function getUserChatContentTopic(address: string) {
  return `/think2earn/1/pm-user-t-${String(address).toLowerCase()}/proto`;
}

export async function initializeNode() {
  console.log("Initializing Waku node...");

  const node = await createLightNode({
    pubsubTopics: [PUBSUB_TOPIC],
    defaultBootstrap: false,
    bootstrapPeers: [
      "/dns4/waku.bloc.domains/tcp/8000/wss/p2p/16Uiu2HAmCbnFaAyzwkCVMyHZJwX87L5nG2bzrzadunFqaC3HsKhN",
      "/dns4/node-01.do-ams3.wakuv2.prod.status.im/tcp/30303/p2p/16Uiu2HAmL5okWopX7NqZWBUKVqW8iUxCEmd5GMHLVPwCgzYzQv3e",
      "/dns4/waku.myrandomdemos.online/tcp/8000/wss/p2p/16Uiu2HAmKfC2QUvMVyBsVjuEzdo1hVhRddZxo69YkBuXYvuZ83sc",
      "/ip4/0.0.0.0/tcp/60002/ws/p2p/16Uiu2HAkzjwwgEAXfeGNMKFPSpc6vGBRqCdTLG5q3Gmk2v4pQw7H",
      "/ip4/0.0.0.0/tcp/60003/ws/p2p/16Uiu2HAmFBA7LGtwY5WVVikdmXVo3cKLqkmvVtuDu63fe8safeQJ",
    ],
    libp2p: {
      peerDiscovery: [wakuPeerExchangeDiscovery([PUBSUB_TOPIC])],
    },
  });

  console.log("Starting Waku node...");
  await node.start();
  console.log("Awaiting remote peer connection...");
  await waitForRemotePeer(node, [Protocols.Filter, Protocols.LightPush, Protocols.Store]);
  console.log("Node initialized successfully");
  return node;
}

export class Client {
  private node?: LightNode;
  private encryptionKeyPair?: { privateKey: Uint8Array; publicKey: Uint8Array };
  private onUserMessageReceived?: (from: string, to: string, tripId: number, datetime: number, message: string) => void;
  private account?: UseAccountReturnType<Config>;

  constructor() {
    this.init = this.init.bind(this);
    this.listenForUserChatMessages = this.listenForUserChatMessages.bind(this);
    this.getUserChatMessages = this.getUserChatMessages.bind(this);
    this.sendUserMessage = this.sendUserMessage.bind(this);
    this.onUserChatMessage = this.onUserChatMessage.bind(this);
  }

  async init(account: UseAccountReturnType<Config>, onUserMessageReceived: (from: string, to: string, tripId: number, datetime: number, message: string) => void, privateKey: string, publicKey: string) {
    // if (isEmpty(privateKey) || isEmpty(publicKey)) {
    //   throw new Error("Private key or public key cannot be empty");
    // }

    this.encryptionKeyPair = {
      privateKey: hexToBytes(privateKey),
      publicKey: hexToBytes(publicKey),
    };
    this.onUserMessageReceived = onUserMessageReceived;
    this.account = account;

    this.node = await initializeNode();
  }

  async listenForUserChatMessages() {
    if (!this.node || !this.encryptionKeyPair || !this.account) return;

    const walletAddress = this.account.address;
    if (walletAddress !== null) {
        const contentTopic = getUserChatContentTopic(walletAddress ?? "");

        const subscription = await this.node.filter.createSubscription();
        await subscription.subscribe(
        eciesDecoder(contentTopic, this.encryptionKeyPair.privateKey, PUBSUB_TOPIC),
        this.onUserChatMessage
        );

        console.log(`Subscribed to messages at ${contentTopic}`);
    }
    else
    {
        console.log(`empty wallet address?`);
    }
  }

  private onUserChatMessage(msg: DecodedMessage) {
    if (!this.onUserMessageReceived || !msg.payload) return;

    const chatMessage = ChatMessage.decode(msg.payload);
    if (!chatMessage) return;

    console.log(`Received message from ${chatMessage.from}`);
    this.onUserMessageReceived(chatMessage.from, chatMessage.to, chatMessage.tripId, chatMessage.datetime, chatMessage.message);
  }

  async getUserChatMessages() {
    if (!this.node || !this.encryptionKeyPair || !this.account) return [];

    const walletAddress = this.account.address ?? "0xEmptyAddress";
    const contentTopic = getUserChatContentTopic(walletAddress);

    // Temporarily sleep to avoid a known issue
    await new Promise((resolve) => setTimeout(resolve, 200));

    try {
      for await (const messageBatch of this.node.store.queryGenerator(
        [eciesDecoder(contentTopic, this.encryptionKeyPair.privateKey, PUBSUB_TOPIC)],
        { timeFilter: { startTime, endTime: new Date() }, pageDirection: PageDirection.BACKWARD, pageSize: 100 }
      )) {
        const messages = (await Promise.all(messageBatch.map(async (msgPromise: any) => {
          const msg = await msgPromise;
          return this.decodeStoreUserChatMessage(msg);
        }))).filter(Boolean);

        console.log(`Restored ${messages.length} messages for user ${walletAddress}`);
        return messages;
      }
    } catch (error) {
      console.error("Failed to retrieve messages", error);
    }
  }

  private decodeStoreUserChatMessage(msg?: DecodedMessage) {
    if (!msg || !msg.payload) return;

    const chatMessage = ChatMessage.decode(msg.payload);
    if (!chatMessage) return;

    return {
      from: chatMessage.from,
      to: chatMessage.to,
      tripId: chatMessage.tripId,
      datetime: chatMessage.datetime,
      message: chatMessage.message,
    };
  }

  async sendUserMessage(toAddress: string, tripId: number, datetime: number, type: string, message: string, tags: Map<string, string>, chatPublicKey: string) {
    if (!this.node || !this.encryptionKeyPair || !this.account) return;

    const fromAddress = this.account.address ?? "0xEmptyAddress";
    // const signature = await signUserChatMessage(fromAddress, toAddress, tripId, datetime, message, this.signer);

    const chatMessage = new ChatMessage({
      from: fromAddress,
      to: toAddress,
      tripId: tripId,
      datetime: datetime,
      type: type,
      message: message,
      tags: JSON.stringify(tags),
      signature: hexToBytes("0xTestSig"),  // TODO for testing
    });

    const payload = chatMessage.encode();
    const recipientEncoder = eciesEncoder({
      contentTopic: getUserChatContentTopic(toAddress),
      publicKey: hexToBytes(chatPublicKey),
      ephemeral: false,
      pubsubTopic: PUBSUB_TOPIC,
    });
    const selfEncoder = eciesEncoder({
      contentTopic: getUserChatContentTopic(fromAddress),
      publicKey: this.encryptionKeyPair.publicKey,
      ephemeral: false,
      pubsubTopic: PUBSUB_TOPIC,
    });

    await this.node.lightPush.send(recipientEncoder, { payload });
    await this.node.lightPush.send(selfEncoder, { payload });
  }
}
