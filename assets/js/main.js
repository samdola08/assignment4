const btnAll = document.querySelector(".btn_all");
const btnInter = document.querySelector(".btn_inter");
const btnRej = document.querySelector(".btn_rej");

const all = document.getElementById("all");
const interview = document.getElementById("interview");
const rejected = document.getElementById("rejected");

btnAll.addEventListener("click", () => {
  btnAll.classList.add("active");
    all.classList.remove("hidden");
  interview.classList.add("hidden");
  btnInter.classList.remove("active");
  rejected.classList.add("hidden");
  btnRej.classList.remove("active");
});

btnInter.addEventListener("click", () => {
  btnInter.classList.add("active");
  all.classList.add("hidden");

  btnAll.classList.remove("active");
  interview.classList.remove("hidden");
  btnRej.classList.remove("active");
  rejected.classList.add("hidden");
});

btnRej.addEventListener("click", () => {
  btnRej.classList.add("active");
  all.classList.add("hidden");

  btnAll.classList.remove("active");
  interview.classList.add("hidden");

  btnInter.classList.remove("active");
    rejected.classList.remove("hidden");
});


// const cards = document.getElementsByClassName('main-card');

// for (let i = 0; i < cards.length; i++) {
//   const interBtn = cards[i].getElementsByClassName('inter')[0];
//   const rejBtn = cards[i].getElementsByClassName('rej')[0];
//   const notAppliedBtn = cards[i].getElementsByClassName('not_applied')[0];

//   interBtn.addEventListener('click', function() {
//     notAppliedBtn.textContent = "Applied";
//     notAppliedBtn.style.backgroundColor = "#10b981";
//     notAppliedBtn.style.color = "white";
//   });

//   rejBtn.addEventListener('click', function() {
//     notAppliedBtn.textContent = "Not Applied";
//     notAppliedBtn.style.backgroundColor = "#eef4ff";
//     notAppliedBtn.style.color = "black";
//   });
// }





const totalCount = document.querySelector('.card.total h2');
const interCount = document.querySelector('.card.interview h2');
const rejCount = document.querySelector('.card.rejected h2');
const availableJobsText = document.querySelector('.main-top p');
const allCards = document.querySelectorAll('#all .main-card');
const noJobsInterview = document.querySelector('#interview .main-avaliable-card');
const noJobsRejected = document.querySelector('#rejected .main-avaliable-card');

let totalJobs = allCards.length;
totalCount.textContent = totalJobs;

let interviewCount = 0;
let rejectedCount = 0;

updateAvailableJobs();

function updateAvailableJobs() {
  const availableJobs = totalJobs - interviewCount - rejectedCount;
  availableJobsText.textContent = availableJobs + " jobs available";
}

function checkEmptySections() {
  const interviewCards = interview.querySelectorAll('.main-card:not(.main-avaliable-card)');
  const rejectedCards = rejected.querySelectorAll('.main-card:not(.main-avaliable-card)');
  
  interviewCount = interviewCards.length;
  rejectedCount = rejectedCards.length;
  
  interCount.textContent = interviewCount;
  rejCount.textContent = rejectedCount;
  
  updateAvailableJobs();
  
  if (interviewCount === 0) {
    noJobsInterview.style.display = 'flex';
  } else {
    noJobsInterview.style.display = 'none';
  }
  
  if (rejectedCount === 0) {
    noJobsRejected.style.display = 'flex';
  } else {
    noJobsRejected.style.display = 'none';
  }
}

function updateCardStatus(card, status) {
  const interBtn = card.querySelector('.inter');
  const rejBtn = card.querySelector('.rej');
  const notAppliedBtn = card.querySelector('.not_applied');
  
  if (status === 'interview') {
    interBtn.classList.add('selected');
    rejBtn.classList.remove('selected');
    notAppliedBtn.textContent = "Applied";
    notAppliedBtn.style.backgroundColor = "#10b981";
    notAppliedBtn.style.color = "white";
  } else if (status === 'rejected') {
    rejBtn.classList.add('selected');
    interBtn.classList.remove('selected');
    notAppliedBtn.textContent = "Rejected";
    notAppliedBtn.style.backgroundColor = "#ef4444";
    notAppliedBtn.style.color = "white";
  } else {
    interBtn.classList.remove('selected');
    rejBtn.classList.remove('selected');
    notAppliedBtn.textContent = "Not Applied";
    notAppliedBtn.style.backgroundColor = "#eef4ff";
    notAppliedBtn.style.color = "black";
  }
}

function setCardStatus(card, status) {
  card.setAttribute('data-status', status);
  updateCardStatus(card, status);
}

function findCardInAll(card) {
  const company = card.querySelector('.description h3').textContent;
  const title = card.querySelector('.description p').textContent;
  
  const allCardsList = document.querySelectorAll('#all .main-card');
  for (let i = 0; i < allCardsList.length; i++) {
    const c = allCardsList[i];
    const cCompany = c.querySelector('.description h3').textContent;
    const cTitle = c.querySelector('.description p').textContent;
    
    if (cCompany === company && cTitle === title) {
      return c;
    }
  }
  return null;
}

function cardExistsInSection(card, section) {
  const company = card.querySelector('.description h3').textContent;
  const title = card.querySelector('.description p').textContent;
  
  const sectionCards = section.querySelectorAll('.main-card:not(.main-avaliable-card)');
  for (let i = 0; i < sectionCards.length; i++) {
    const c = sectionCards[i];
    const cCompany = c.querySelector('.description h3').textContent;
    const cTitle = c.querySelector('.description p').textContent;
    
    if (cCompany === company && cTitle === title) {
      return c;
    }
  }
  return null;
}

function setupCardButtons(card) {
  const interBtn = card.querySelector('.inter');
  const rejBtn = card.querySelector('.rej');
  const deleteIcon = card.querySelector('.bi-trash');
  
  interBtn.addEventListener('click', function() {
    const parent = card.parentNode;
    const allCard = findCardInAll(card);
    
    if (parent === rejected) {
      card.remove();
      setCardStatus(card, 'interview');
      interview.appendChild(card);
      
      if (allCard) {
        setCardStatus(allCard, 'interview');      }
      checkEmptySections();      
    } else if (parent === all) {
      const existingInInterview = cardExistsInSection(card, interview);
      const existingInRejected = cardExistsInSection(card, rejected);
      
      if (!existingInInterview && !existingInRejected) {
        const clone = card.cloneNode(true);
        setupCardButtons(clone);
        setCardStatus(clone, 'interview');
        interview.appendChild(clone);
        setCardStatus(card, 'interview');
        checkEmptySections();
      } else if (existingInRejected) {
        existingInRejected.remove();
        
        const clone = card.cloneNode(true);
        setupCardButtons(clone);
        setCardStatus(clone, 'interview');
        interview.appendChild(clone);
        setCardStatus(card, 'interview');
        checkEmptySections();
      }
    }
  });
  
  rejBtn.addEventListener('click', function() {
    const parent = card.parentNode;
    const allCard = findCardInAll(card);
    
    if (parent === interview) {
      card.remove();
      setCardStatus(card, 'rejected');
      rejected.appendChild(card);
      
      if (allCard) {
        setCardStatus(allCard, 'rejected');
      }
      checkEmptySections();
      
    } else if (parent === all) {
      const existingInInterview = cardExistsInSection(card, interview);
      const existingInRejected = cardExistsInSection(card, rejected);
      
      if (!existingInInterview && !existingInRejected) {
        const clone = card.cloneNode(true);
        setupCardButtons(clone);
        setCardStatus(clone, 'rejected');
        rejected.appendChild(clone);
        setCardStatus(card, 'rejected');
        checkEmptySections();
      } else if (existingInInterview) {
        existingInInterview.remove();        
        const clone = card.cloneNode(true);
        setupCardButtons(clone);
        setCardStatus(clone, 'rejected');
        rejected.appendChild(clone);
        setCardStatus(card, 'rejected');
        checkEmptySections();
      }
    }
  });
  
  deleteIcon.addEventListener('click', function() {
    const parent = card.parentNode;
    const allCard = findCardInAll(card);
    
    card.remove();
    
    if (parent === all) {
      if (allCard) {
        const existingInInterview = cardExistsInSection(card, interview);
        const existingInRejected = cardExistsInSection(card, rejected);
        
        if (existingInInterview) existingInInterview.remove();
        if (existingInRejected) existingInRejected.remove();
      }
      
      totalJobs--;
    } else if (parent === interview) {
      if (allCard) {
        setCardStatus(allCard, 'default');
      }
      totalJobs--;
    } else if (parent === rejected) {
      if (allCard) {
        setCardStatus(allCard, 'default');
      }
   
      totalJobs--;
    }
 
    totalCount.textContent = totalJobs;
    
    checkEmptySections();
  });
}
for (let i = 0; i < allCards.length; i++) {
  const card = allCards[i];
  setCardStatus(card, 'default');
  setupCardButtons(card);
}

checkEmptySections();