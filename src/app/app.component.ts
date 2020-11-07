import { Component } from "@angular/core";

class User {
  nickname: string;
  photo: string;

  constructor(nickname: string, photo: string) {
    this.nickname = nickname;
    this.photo = photo;
  }
}

class Message {
  user_from: User;
  text: string;
  time: string;

  constructor(text: string, user_from: User, time: string) {
    this.text = text;
    this.user_from = user_from;
    this.time = time;
  }
}

class Dialog {
  user1: User;
  user2: User;
  messages: Message[];

  constructor(user1: User, user2: User, messages: Message[]) {
    this.user1 = user1;
    this.user2 = user2;
    this.messages = messages;
  }
}

@Component({
  selector: "chat-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  me: User = new User("Me", "https://icon-library.com/images/anonymous-user-icon/anonymous-user-icon-2.jpg");

  users: User[] = [
    { nickname: "Vasya", photo: "https://p1.hiclipart.com/preview/875/665/299/hospital-watercolor-paint-wet-ink-avatar-person-man-user-profile-png-clipart.jpg" },
    { nickname: "Julia", photo: "https://p1.hiclipart.com/preview/812/807/813/businessperson-avatar-user-profile-business-administration-watercolor-paint-wet-ink-marketing-blog-cartoon-smile-png-clipart.jpg" },
    { nickname: "John", photo: "https://p1.hiclipart.com/preview/779/305/262/web-design-watercolor-paint-wet-ink-avatar-business-businessperson-user-profile-png-clipart.jpg" },
    { nickname: "Котик", photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQgJdj-GFdQJKq3kMHu1p5RYb1dA2BIWItRiA&usqp=CAU" }
  ];

  loadMessages(i: number) {
    let res = [];
    let item = JSON.parse(localStorage.getItem("dialogs[" + i + "].messages"));
    if (item) res = item;
    return res;
  }

  dialogs: Dialog[] = [
    {
      user1: this.me,
      user2: this.users[0],
      messages: [
        {
          time: new Date("2020-10-24").toISOString(),
          text: "Privet",
          user_from: this.users[0]
        },
        {
          time: new Date("2020-10-24").toISOString(),
          text: "Privet",
          user_from: this.me
        },
        {
          time: new Date("2020-10-27").toISOString(),
          text:
            'George Thorogood was inspired by Chuck Norris, when he composed "Bad to the Bone".',
          user_from: this.users[0]
        }
      ].concat(this.loadMessages(0))
    },

    {
      user1: this.me,
      user2: this.users[1],
      messages: [
        {
          time: new Date("2020-10-30").toISOString(),
          text: "Privet",
          user_from: this.users[1]
        }
      ].concat(this.loadMessages(1))
    },

    {
      user1: this.me,
      user2: this.users[2],
      messages: [
        {
          text: "Privet",
          user_from: this.users[2],
          time: new Date("2020-10-26").toISOString()
        },
        {
          text: "Kak dela?",
          user_from: this.users[2],
          time: new Date("2020-10-27").toISOString()
        }
      ].concat(this.loadMessages(2))
    },

    {
      user1: this.me,
      user2: this.users[3],
      messages: [
        {
          text: "Privet",
          user_from: this.users[3],
          time: new Date("2020-10-26").toISOString()
        },
        {
          text: "Kak dela?",
          user_from: this.users[3],
          time: new Date("2020-10-28").toISOString()
        }
      ].concat(this.loadMessages(3))
    }
  ];

  sortedDialogs(): Dialog[] {
    return this.dialogs.slice().sort(function(a, b) {
      return a.messages[a.messages.length - 1].time >
        b.messages[b.messages.length - 1].time
        ? -1
        : a.messages[a.messages.length - 1].time <
          b.messages[b.messages.length - 1].time
        ? 1
        : 0;
    });
  }

  findDialog: Dialog[] = this.dialogs;
  currUser: User = new User("", "https://icon-library.com/images/anonymous-user-icon/anonymous-user-icon-2.jpg");
  currDialog: Message[];
  message: string;
  findUser: User;

  currentUser(u: User) {
    this.currUser = u;
    for (let d of this.dialogs) {
      if (d.user2 == this.currUser) {
        this.currDialog = d.messages;
      }
    }
  }

  findout() {
    this.findUser = new User("", "");
  }

  pushCurrentDialog(user_from: User, user_to: User, text: string) {
    for (let d of this.dialogs) {
      if (
        d.user2.nickname == user_to.nickname ||
        d.user2.nickname == user_from.nickname
      ) {
        d.messages.push({
          text: text,
          user_from: user_from,
          time: new Date(Date.now()).toISOString()
        });
        localStorage.setItem(
          "dialogs[" + this.dialogs.indexOf(d) + "].messages",
          JSON.stringify(d.messages)
        );
      }
    }
  }

  async sendMessage(message: string) {
    if (message == "") return;
    let sendUser = this.currUser;
    this.pushCurrentDialog(this.me, sendUser, message);
    this.message = "";

    let reply_joke = "";
    await fetch("https://api.chucknorris.io/jokes/random").then(res => {
      res.json().then(txt => {
        reply_joke = txt["value"];
        if (reply_joke != "") {
          setTimeout(() => {
            this.pushCurrentDialog(sendUser, this.me, reply_joke);
          }, 10000);
        }
      });
    });
  }
}
