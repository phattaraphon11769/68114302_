"use strict";


/* =========================
   EXCHANGE RATES
========================= */

const RATES = {

    THB: {
        USD: 0.028,
        EUR: 0.024
    },

    USD: {
        THB: 35.50,
        EUR: 0.86
    },

    EUR: {
        THB: 41.30,
        USD: 1.16
    }

};


/* =========================
   GET ELEMENTS
========================= */

const amountOne =
    document.getElementById("amount-one");

const amountTwo =
    document.getElementById("amount-two");

const currencyOne =
    document.getElementById("currency-one");

const currencyTwo =
    document.getElementById("currency-two");

const convertButton =
    document.getElementById("convert");

const swapButton =
    document.getElementById("swap");

const clearButton =
    document.getElementById("clear");

const clearHistoryButton =
    document.getElementById("clear-history");

const rateText =
    document.getElementById("rate");

const timeText =
    document.getElementById("time");

const rateBadge =
    document.getElementById("rate-badge");

const historyList =
    document.getElementById("history");


/* =========================
   GET RATE
========================= */

function getRate(from, to) {

    if (from === to) {

        return 1;

    }

    if (
        RATES[from] &&
        RATES[from][to]
    ) {

        return RATES[from][to];

    }

    return null;

}


/* =========================
   FORMAT NUMBER
========================= */

function formatNumber(number) {

    return Number(number).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

}


/* =========================
   UPDATE RATE
========================= */

function updateRate() {

    const from =
        currencyOne.value;

    const to =
        currencyTwo.value;

    const exchangeRate =
        getRate(from, to);


    if (exchangeRate === null) {

        rateText.textContent =
            "ไม่พบอัตราแลกเปลี่ยน";

        rateBadge.textContent =
            "ไม่มีข้อมูล";

        return;

    }


    rateText.textContent =
        `1 ${from} = ${exchangeRate} ${to}`;

    rateBadge.textContent =
        `${from} → ${to}`;

}


/* =========================
   CONVERT
========================= */

function convert() {

    const from =
        currencyOne.value;

    const to =
        currencyTwo.value;


    let amount;

    let fromFirstBox = true;


    /*
        ถ้าช่องแรกมีข้อมูล
    */

    if (
        amountOne.value !== ""
    ) {

        amount =
            Number(amountOne.value);

        fromFirstBox = true;

    }


    /*
        ถ้าช่องแรกไม่มี
        แต่ช่องสองมีข้อมูล
    */

    else if (
        amountTwo.value !== ""
    ) {

        amount =
            Number(amountTwo.value);

        fromFirstBox = false;

    }


    /*
        ไม่มีจำนวนเงิน
    */

    else {

        alert(
            "กรุณากรอกจำนวนเงิน"
        );

        amountOne.focus();

        return;

    }


    /*
        ตรวจสอบตัวเลข
    */

    if (
        !Number.isFinite(amount) ||
        amount < 0
    ) {

        alert(
            "กรุณากรอกจำนวนเงินที่ถูกต้อง"
        );

        return;

    }


    /*
        หาอัตราแลกเปลี่ยน
    */

    const exchangeRate =
        getRate(from, to);


    if (exchangeRate === null) {

        alert(
            "ไม่พบอัตราแลกเปลี่ยน"
        );

        return;

    }


    /*
        คำนวณ
    */

    if (fromFirstBox) {

        const result =
            amount * exchangeRate;

        amountTwo.value =
            result.toFixed(2);

    }

    else {

        const result =
            amount / exchangeRate;

        amountOne.value =
            result.toFixed(2);

    }


    /*
        แสดง Rate
    */

    updateRate();


    /*
        แสดงเวลา
    */

    const now =
        new Date();

    timeText.textContent =
        "อัปเดตล่าสุด: " +
        now.toLocaleString(
            "th-TH"
        );


    /*
        บันทึกประวัติ
    */

    saveHistory();

}


/* =========================
   SWAP
========================= */

function swapCurrency() {


    /*
        สลับสกุลเงิน
    */

    const oldCurrency =
        currencyOne.value;

    currencyOne.value =
        currencyTwo.value;

    currencyTwo.value =
        oldCurrency;


    /*
        สลับจำนวนเงิน
    */

    const oldAmount =
        amountOne.value;

    amountOne.value =
        amountTwo.value;

    amountTwo.value =
        oldAmount;


    /*
        Update UI
    */

    updateRate();


    rateText.textContent =
        "สลับสกุลเงินแล้ว กดแปลงเงินเพื่อคำนวณ";

    timeText.textContent =
        "รอการคำนวณ";

}


/* =========================
   CLEAR
========================= */

function clearData() {

    amountOne.value =
        "";

    amountTwo.value =
        "";


    rateText.textContent =
        "กรอกจำนวนเงินเพื่อเริ่มคำนวณ";

    timeText.textContent =
        "ยังไม่มีรายการคำนวณ";

    rateBadge.textContent =
        "พร้อมคำนวณ";


    amountOne.focus();

}


/* =========================
   LOAD HISTORY
========================= */

function loadHistory() {

    try {

        const history =
            JSON.parse(
                localStorage.getItem(
                    "rateLabHistory"
                )
            );

        if (
            Array.isArray(history)
        ) {

            return history;

        }

    }

    catch (error) {

        console.error(
            "History error:",
            error
        );

    }


    return [];

}


/* =========================
   SAVE HISTORY
========================= */

function saveHistory() {

    if (
        amountOne.value === "" ||
        amountTwo.value === ""
    ) {

        return;

    }


    const newItem = {

        fromAmount:
            Number(amountOne.value),

        fromCurrency:
            currencyOne.value,

        toAmount:
            Number(amountTwo.value),

        toCurrency:
            currencyTwo.value

    };


    let history =
        loadHistory();


    /*
        เพิ่มรายการใหม่ด้านบน
    */

    history.unshift(
        newItem
    );


    /*
        เก็บ 10 รายการ
    */

    history =
        history.slice(
            0,
            10
        );


    localStorage.setItem(
        "rateLabHistory",
        JSON.stringify(history)
    );


    renderHistory();

}


/* =========================
   RENDER HISTORY
========================= */

function renderHistory() {

    const history =
        loadHistory();


    historyList.innerHTML =
        "";


    history.forEach(
        function(item) {

            const li =
                document.createElement(
                    "li"
                );


            const left =
                document.createElement(
                    "span"
                );


            left.textContent =
                `${formatNumber(
                    item.fromAmount
                )} ${item.fromCurrency}`;


            const right =
                document.createElement(
                    "span"
                );


            right.textContent =
                `${formatNumber(
                    item.toAmount
                )} ${item.toCurrency}`;


            li.appendChild(
                left
            );


            li.appendChild(
                document.createTextNode(
                    " → "
                )
            );


            li.appendChild(
                right
            );


            historyList.appendChild(
                li
            );

        }
    );

}


/* =========================
   CLEAR HISTORY
========================= */

function clearHistory() {

    localStorage.removeItem(
        "rateLabHistory"
    );


    renderHistory();

}


/* =========================
   INPUT BEHAVIOR
========================= */


/*
    ถ้าพิมพ์ช่องแรก
    ล้างช่องสอง
*/

amountOne.addEventListener(
    "input",
    function() {

        if (
            amountOne.value !== ""
        ) {

            amountTwo.value =
                "";

        }

    }
);


/*
    ถ้าพิมพ์ช่องสอง
    ล้างช่องแรก
*/

amountTwo.addEventListener(
    "input",
    function() {

        if (
            amountTwo.value !== ""
        ) {

            amountOne.value =
                "";

        }

    }
);


/* =========================
   ENTER KEY
========================= */

amountOne.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            convert();

        }

    }
);


amountTwo.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Enter"
        ) {

            convert();

        }

    }
);


/* =========================
   EVENTS
========================= */

convertButton.addEventListener(
    "click",
    convert
);


swapButton.addEventListener(
    "click",
    swapCurrency
);


clearButton.addEventListener(
    "click",
    clearData
);


clearHistoryButton.addEventListener(
    "click",
    clearHistory
);


currencyOne.addEventListener(
    "change",
    updateRate
);


currencyTwo.addEventListener(
    "change",
    updateRate
);


/* =========================
   START APP
========================= */

updateRate();

renderHistory();