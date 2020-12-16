import express from 'express';
import fs from 'fs';

class ImageServer {
  constructor(private inboxPath : string) {}

  getServer() {
    const server = express();
    server.get('/:conversationID/:imageID', (req, res) => {
      const picturePath = `${this.inboxPath}/extraction/messages/inbox/${req.params.conversationID}/photos`;
      fs.readdir(picturePath, (err, files) => {
        if (err) {
          res.sendStatus(404);
          return;
        }
        const pictureFileName = files.find((f) => f.includes(req.params.imageID));
        if (!pictureFileName) {
          res.sendStatus(404);
          return;
        }

        const absoluteName = `${picturePath}/${pictureFileName}`;
        res.sendFile(absoluteName);
      });
    });
    return server;
  }
}

export default ImageServer;
