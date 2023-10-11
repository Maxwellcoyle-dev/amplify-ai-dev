// LangChain Imports
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT = `Given the following conversation and a follow up question, return the conversation history excerpt that includes any relevant context to the question if it exists and rephrase the follow up question to be a standalone question.
Chat History:
{chat_history}
Follow Up Input: {question}
Your answer should follow the following format:
\`\`\`
Use the following pieces of context to answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
<Relevant chat history excerpt as context here>
Standalone question: <Rephrased question here>
\`\`\`
Your answer:`;

const docQA = async (apiKey) => {
  try {
    console.log(apiKey);
    // Initialize the LLM to use to answer the question.
    const model = new ChatOpenAI({
      model: "gpt-3.5-turbo-16k",
      openAIApiKey: apiKey,
    });

    // create the memory buffer
    const memory = new BufferMemory({
      memoryKey: "chat_history",
      returnMessages: true,
      inputKey: "question",
      outputKey: "text",
    });

    // Load the documents to use as context.
    const loader = new DirectoryLoader("/tmp", {
      ".pdf": (path) => new PDFLoader(path),
      ".docx": (path) => new DocxLoader(path),
      ".txt": (path) => new TextLoader(path),
    });
    const loadedDocs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(loadedDocs);

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: apiKey,
    });

    // Create a vector store from the documents.
    const vectorStore = await MemoryVectorStore.fromDocuments(
      splitDocs,
      embeddings
    );

    // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        returnSourceDocuments: true,
        memory,
        questionGeneratorChainOptions: {
          template: CUSTOM_QUESTION_GENERATOR_CHAIN_PROMPT,
        },
      }
    );
    const res = await chain.call({
      question:
        "My client is using connect to integrate outlook 365 with Docebo. What will the key benefits be?",
    });
    console.log({ res });

    const followUpRes = await chain.call({
      question: "What integration is my client trying create?",
    });

    console.log({ followUpRes });

    return { res, followUpRes };
  } catch (error) {
    console.log({ error });
    return error;
  }
};

export { docQA };
