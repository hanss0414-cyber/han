const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("show"));
}

// Google Apps Script로 댓글 전송
const commentForm = document.getElementById("comment-form");
const commentInput = document.getElementById("comment-message");
const commentCount = document.getElementById("comment-count");
const commentStatus = document.getElementById("comment-status");
const commentSubmit = document.getElementById("comment-submit");
const responseFrame = document.getElementById("comment-response-frame");

let waitingForResponse = false;
let responseTimer = null;

if (commentInput && commentCount) {
  commentInput.addEventListener("input", () => {
    commentCount.textContent = String(commentInput.value.length);
  });
}

if (commentForm && commentInput && commentStatus && commentSubmit && responseFrame) {
  commentForm.addEventListener("submit", (event) => {
    const message = commentInput.value.trim();

    if (!message) {
      event.preventDefault();
      commentStatus.textContent = "메시지를 입력해주세요.";
      commentStatus.className = "comment-status error";
      commentInput.focus();
      return;
    }

    if (message.length > 500) {
      event.preventDefault();
      commentStatus.textContent = "메시지는 500자 이내로 입력해주세요.";
      commentStatus.className = "comment-status error";
      return;
    }

    if (waitingForResponse) {
      event.preventDefault();
      return;
    }

    waitingForResponse = true;
    commentSubmit.disabled = true;
    commentSubmit.textContent = "전송 중...";
    commentStatus.textContent = "Google Sheets로 전송하고 있습니다.";
    commentStatus.className = "comment-status";

    responseTimer = window.setTimeout(() => {
      if (!waitingForResponse) return;
      waitingForResponse = false;
      commentSubmit.disabled = false;
      commentSubmit.innerHTML = '보내기 <span>→</span>';
      commentStatus.textContent = "응답이 늦어지고 있습니다. 스프레드시트에 저장됐는지 확인한 뒤 다시 시도해주세요.";
      commentStatus.className = "comment-status error";
    }, 15000);
  });

  responseFrame.addEventListener("load", () => {
    if (!waitingForResponse) return;

    waitingForResponse = false;
    if (responseTimer) window.clearTimeout(responseTimer);

    commentSubmit.disabled = false;
    commentSubmit.innerHTML = '보내기 <span>→</span>';
    commentStatus.textContent = "서버 응답을 받았습니다. Google 스프레드시트의 '문의' 시트에서 저장 여부를 확인해주세요.";
    commentStatus.className = "comment-status success";
  });
}
