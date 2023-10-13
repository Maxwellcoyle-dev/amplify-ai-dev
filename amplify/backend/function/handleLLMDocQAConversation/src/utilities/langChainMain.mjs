// LLM
import { ChatOpenAI } from "langchain/chat_models/openai";

// Chain
import { ConversationalRetrievalQAChain } from "langchain/chains";

// Embedding / Vector Store
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// utility functions
import { getThreadMessages } from "./getThreadMessages.mjs";
import { prepDocs } from "./prepDocs.mjs";
import { setMemoryBuffer } from "./setMemoryBuffer.mjs";
import { updateThread } from "./updateThread.mjs";
import { buildMessageLists } from "./buildMessageLists.mjs";

// payload definition
// const payload = {
//   apiKey: "",
//   question: "",
//   userID: "",
//   threadID: "",
// };

export const langChainMain = async (payload) => {
  try {
    console.log("langChainMain payload: ", payload);
    // get 2 versions of the messages array
    // 1. for the buffer memory
    // 2. for the message update
    const currentThreadMessages = await getThreadMessages(
      payload.userID,
      payload.threadID
    );

    // use the current threadMessageList + the new question to build the
    // buffer memory list for this query
    const { bufferMessageList, messageList } = buildMessageLists(
      currentThreadMessages,
      payload.question
    );

    // send messages array to memory buffer
    const bufferMemory = await setMemoryBuffer(bufferMessageList);

    // Load the documents to use as context.
    const splitDocs = await prepDocs();

    // Set up embeddings with the OpenAIEmbeddings class.
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: payload.apiKey,
    });

    // Create a vector store - pass documents and openAIEmbeddings.
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      embeddings
    );

    // Create a chat model to use in the chain
    const model = new ChatOpenAI({
      model: "gpt-3.5-turbo-16k",
      openAIApiKey: payload.apiKey,
    });

    // Create a chain that uses the OpenAI LLM and MemoryVectorStore.
    // in options pass in the memory buffer + returnSourceDocuments: true / false
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        returnSourceDocuments: true,
        memory: bufferMemory,
      }
    );

    // call the chain using the question from the payload - user submission
    const res = await chain.call({
      question: payload.question,
    });

    console.log("Res: ", res);
    console.log("messageList: ", messageList);

    updateThread({
      userID: payload.userID,
      threadID: payload.threadID,
      messageList: messageList,
      assistantResponse: res.text,
    });

    return { res };
  } catch (error) {
    console.log({ error });
    return error;
  }
};
