const qrcode = require("qrcode");
const { body, validationResult, MessageMedia } = require("express-validator");
const { Client, LocalAuth } = require("whatsapp-web.js");
const express = require("express");
const port = 4001;
const http = require("http");
const socketIO = require("socket.io");
const { phoneNumberFormatter } = require("./helpers/formatter");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const axios = require("axios");
// const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const mime = require("mime-types");
const https = require("https");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(
//   fileUpload({
//     debug: false,
//   })
// );

app.get("/", (req, res) => {
  res.sendFile("index.html", {
    root: __dirname,
  });
});

// const client = new Client({
//   restartOnAuthFail: true,
//   puppeteer: {
//     headless: true,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//       "--disable-accelerated-2d-canvas",
//       "--no-first-run",
//       "--no-zygote",
//       "--single-process", // <- this one doesn't works in Windows
//       "--disable-gpu",
//     ],
//   },
//   authStrategy: new LocalAuth(),
// });

const client = new Client();

client.on("ready", function () {
  client.getChats().then((chats) => {
    const myGroup = chats.find((chat) => chat.name == "My note🔥");
    setTimeout(
      () => client.sendMessage(myGroup.id._serialized, "Hallo Ayank"),
      20000
    );
    console.log(myGroup);
    // console.log(myGroup);
  });
});
// SEND MESSAGE FOR CLIENT
client.on("message", async (message) => {
  if (message.body == "!ping") {
    message.reply("pong");
  } else if (message.body == "good morning") {
    message.reply("hai");
  } else if (message.body == "!groups") {
    client.getChats().then((chats) => {
      const groups = chats.filter((chat) => chat.isGroup);

      if (groups.length == 0) {
        message.reply("You have no group yet.");
      } else {
        let replyMsg = "*YOUR GROUPS*\n\n";
        groups.forEach((group, i) => {
          replyMsg += `ID: ${group.id._serialized}\nName: ${group.name}\n\n`;
        });
        replyMsg +=
          "_You can use the group id to send a message to the group._";
        message.reply(replyMsg);
      }
    });
  } else if (message.body === "!test") {
    client.sendMessage(message.from, "test");
  } else if (message.body === "!list-command") {
    message.reply(
      `
==== DAFTAR PERINTAH BOT ====
!k-announcement
      
!k-info
      
!k-dev
      
!k-anggota

!k-news
          
!k-owner

!groups(jangan terlalu sering)


=== PT .Berkah Jaya Nusantara Wwkkw =`
    );
  } else if (message.body === "!k-info") {
    client.sendMessage(message.from, "ini info");
  } else if (message.body === "!k-announcement") {
    const msgx = `
    [REMINDER]

Please, ini cuma pengumuman biasa aja ﻿ 
    
Terms and Conditions 
    
Please send this message﻿
================
!k-announcement﻿ ﻿﻿﻿ 
================
    
Alert!!! ﻿ 
    
Thank you for your attention`;
    client.sendMessage(message.from, msgx);
  } else if (message.body === "!k-news") {
    let data = "";
    axios
      .get("https://api-berita-indonesia.vercel.app/antara/lifestyle/", {
        headers: { "Accept-Encoding": "gzip,deflate,compress" },
      })
      .then((ping) => {
        const news = ping.data.data.posts[0];
        data = ` 
========= Berita Hari Ini ========
1.title : ${news.title}
2.link : ${news.link}
        `;
        client.sendMessage(message.from, data);
      })
      .catch((err) => {
        console.log("Error: ", err.message);
      });
  } else if (message.body === "!k-anggota") {
    client.sendMessage(
      message.from,
      `
========= Daftar Anggota ========
1.Dwi Wijayanto (001)
dwin@gamil.com
  [programmer]
  @gmail.com
2.Winarno (002)
  narnowin195@gmail.com
  [Laravel Programmer at  cyberolympus]
  @gmail.com
3.Ridlo Fauzi (003)
  [Student at the University of Duta Bangsa University]
  @gmail.com
4.Satria Baja Hitam (004)
  [Student at the University of Muhammadiyah University Of Karayanganyar]
  @gmail.com
5.JEFA (005)
  [Student at the University of Muhammadiyah University Of Karayanganyar]
  @gmail.com
6.Rian Maulana (006)
  [Laravel Programmer At Yureka Teknologi Cipta]
  @gmail.com  
    `
    );
  } else if (message.body === "!k-dev") {
    const msgz = `
Daftar Channel Youtube Programming & Teknologi Indonesia indonesia
1.BackEnd
  a.Kelas Terbuka           
  (https://www.youtube.com/c/KelasTerbuka) Python, Java, C++, Matlab, Livestreaming

  b.Programmer Zaman Now    
  (https://www.youtube.com/c/ProgrammerZamanNow) Python, Docker, Elasticsearch, Kubernetes, TypeScript, JS,
  Redis, MongoDB, Java, PHP, MySQL	

  c.Kawan Koding	        
  (https://www.youtube.com/c/kawankoding) Laravel, Livewire	

  d.Parsinta	              
  (https://www.youtube.com/c/Parsinta) Laravel, TDD, Breeze, Vue, Tailwind	

  e. VIP CODE STUDIO		      
  https://www.youtube.com/c/vipcodestudio) NodeJS, Discord.js, Figma	
      
  f.Agung Setiawan	        
  (https://www.youtube.com/c/AgungSetiawanCoding) Golang, Python, Ruby	
    
2.Frontend
  a.ArrayID                 
    (https://www.youtube.com/c/KelasTerbuka) JS, CSS, TailwindCSS, NextJS, ReactJS

  b.Balademy                
    (https://www.youtube.com/channel/UCo2MhO0TrEUKdL9Pt-JNgLg) Angular, Livewire, Vue	

  c.Prawito Hudoro	        
    (https://www.youtube.com/c/prawitohudoro) ReactJS, NextJS, React Native, MERN, JS, Livestreaming	

  d.Wahidev Academy		      
    (https://www.youtube.com/c/WahidevAcademy) React, React Native 
  
3.General
  a.Wpu                      
    (http://youtube.com/webprogrammingunpas)HTML, CSS, Javascript, PHP, Git, GitHub, SASS,
    Bootstrap, NodeJS, CodeIgniter, Laravel, Livestreaming
    `;
    client.sendMessage(message.from, msgz);
  } else if (message.body == "!k-owner") {
    const media = MessageMedia.fromFilePath("./img/film-minion.jpg");
    chat.sendMessage(media);
    // } else if (msg.body === "!resendmedia" && msg.hasQuotedMsg) {
    //   const quotedMsg = await msg.getQuotedMessage();
    //   if (quotedMsg.hasMedia) {
    //     const attachmentData = await quotedMsg.downloadMedia();
    //     client.sendMessage(msg.from, attachmentData, {
    //       caption: "Here's your requested media.",
    //     });
    //   }
    // }
  }
});
client.initialize();
// Socket IO
io.on("connection", function (socket) {
  socket.emit("message", "Connecting...");

  client.on("qr", (qr) => {
    console.log("QR RECEIVED", qr);
    socket.emit("qrcode", "okee");
    qrcode.toDataURL(qr, (err, url) => {
      socket.emit("qrcode", url);
      socket.emit("message", "QR Code received, scan please!");
    });
  });

  client.on("ready", () => {
    socket.emit("ready", "Whatsapp is ready!");
    socket.emit("message", "Whatsapp is ready!");
  });

  client.on("authenticated", () => {
    socket.emit("authenticated", "Whatsapp is authenticated!");
    socket.emit("message", "Whatsapp is authenticated!");
    console.log("AUTHENTICATED");
  });

  client.on("auth_failure", function (session) {
    socket.emit("message", "Auth failure, restarting...");
  });

  client.on("disconnected", (reason) => {
    socket.emit("message", "Whatsapp is disconnected!");
    client.destroy();
    client.initialize();
  });
});

const checkRegisteredNumber = async function (number) {
  const isRegistered = await client.isRegisteredUser(number);
  return isRegistered;
};

// Send message
app.post(
  "/send-message",
  [body("number").notEmpty(), body("message").notEmpty()],
  async (req, res) => {
    console.log(res);
    const errors = validationResult(req).formatWith(({ msg }) => {
      return msg;
    });

    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: errors.mapped(),
      });
    }

    const number = phoneNumberFormatter(req.body.number);
    const message = req.body.message;
    const data = `Kode OTP ${message}. Berlaku 5 menit. Jangan beritahu kode ini kepada siapapun!`;

    const isRegisteredNumber = await checkRegisteredNumber(number);

    if (!isRegisteredNumber) {
      return res.status(422).json({
        status: false,
        message: "The number is not registered",
      });
    }

    client
      .sendMessage(number, data)
      .then((response) => {
        res.status(200).json({
          status: true,
          response: response,
        });
      })
      .catch((err) => {
        res.status(500).json({
          status: false,
          response: err,
        });
      });
  }
);

// Send media
app.post("/send-media", async (req, res) => {
  const number = phoneNumberFormatter(req.body.number);
  const caption = req.body.caption;
  const fileUrl = req.files.file;
  let mimetype;
  const attachment = await axios
    .get(fileUrl, {
      responseType: "arraybuffer",
    })
    .then((response) => {
      mimetype = response.headers["content-type"];
      return response.data.toString("base64");
    });

  const media = new MessageMedia(mimetype, attachment, "Media");

  client
    .sendMessage(number, media, {
      caption: caption,
    })
    .then((response) => {
      res.status(200).json({
        status: true,
        response: response,
      });
    })
    .catch((err) => {
      res.status(500).json({
        status: false,
        response: err,
      });
    });
});
server.listen(port, function () {
  console.log("App running on *: " + port);
});
