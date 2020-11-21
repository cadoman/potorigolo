/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import React, { useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import ExtractZip from './components/ExtractZip';
import ConversationSummary from './models/ConversationSummary';
import FrontAPI from './FrontAPI';
import AllConversations from './components/AllConversations';

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);
const App = () => {
  const [conversationSummaries, setConversationSummaries] = useState<ConversationSummary[]>([]);
  const getSummary = () => {
    FrontAPI.getSummary()
      .then((summaries) => {
        summaries.sort((a, b) => new Date(b.last_update).getTime() - new Date(a.last_update).getTime());
        setConversationSummaries(summaries);
      })
      .catch(() => {});
  };

  useEffect(getSummary, []);
  return (
    <>
      <header>
        <h1>
          Poto Rigolo

        </h1>
      </header>
      <section>
        {
          conversationSummaries.length
            ? <AllConversations summaries={conversationSummaries} />
            : <ExtractZip onSummaryGenerated={getSummary} />
        }

      </section>
    </>
  );
};
ReactDom.render(<App />, mainElement);
