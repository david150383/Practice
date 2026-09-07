// const date = new Date("2024-01-14T00:00:00.000Z");
// date.setUTCDate(date.getUTCDate() + 1);

// console.log(date.toISOString());
// // "2024-01-15T00:00:00.000Z"

// const apiDataArray = [
//   { date: "2022-02-10T13:10:00.000Z", value: 10 },
//   { date: "2022-02-10T13:15:00.000Z", value: 20 },
//   { date: "2022-02-10T13:20:00.000Z", value: 30 },
//   { date: "2022-02-10T13:30:00.000Z", value: 25 },
//   { date: "2022-02-12T07:00:00.000Z", value: 5 },
//   { date: "2022-02-08T06:00:00.000Z", value: 40 },
//   { date: "2022-02-04T06:00:00.000Z", value: 40 },
//   { date: "2022-02-28T06:00:00.000Z", value: 40 },
// ];
// const apiData = JSON.stringify(apiDataArray);
// console.log(apiData);

const https = require("https");
https
  .get("https://coderbyte.com/api/challenges/json/date-list", (res) => {
    let data = "";

    // Check for successful response
    if (res.statusCode !== 200) {
      console.error(`Request failed. Status code: ${res.statusCode}`);
      res.resume(); // consume response data to free memory
      return;
    }

    // Collect data chunks
    res.on("data", (chunk) => {
      data += chunk;
    });

    // Parse JSON when complete
    res.on("end", () => {
      try {
        const records = JSON.parse(data);

        console.log(getRecordsPerDay(records));
      } catch (err) {
        console.error("Error parsing JSON:", err.message);
      }
    });
  })
  .on("error", (err) => {
    console.error("Request error:", err.message);
  });

//Adastan don't asked for only one, so i did only for practive
function onlyOneRecordPerDay(records) {
  //ChatGPT optimize code
  const map = Object.create(null);
  let minTime = Infinity;
  let maxTime = -Infinity;

  for (const r of records) {
    const time = Date.parse(r.date); // number
    const dayKey = r.date.slice(0, 10); // YYYY-MM-DD

    // track range
    if (time < minTime) minTime = time;
    if (time > maxTime) maxTime = time;

    // keep latest record per day
    if (!map[dayKey] || Date.parse(map[dayKey].date) > time) {
      map[dayKey] = r;
    }
  }

  const result = [];
  let current = new Date(minTime);
  const end = new Date(maxTime);

  while (current <= end) {
    const iso = current.toISOString();
    const key = iso.slice(0, 10);

    result.push(map[key] ?? { date: iso, value: 0 });

    current.setUTCDate(current.getUTCDate() + 1);
  }

  //My Code
  // const records = JSON.parse(apiData);

  // const map = {};
  // let from = null;
  // let to = null;

  // for (const record of records) {
  //   const dateObj = new Date(record.date);
  //   const dateKey = record.date.slice(0, 10); // YYYY-MM-DD

  //   // Find date range
  //   if (from === null || record.date < from) from = record.date;
  //   if (to === null || record.date > to) to = record.date;

  //   // Keep the latest record per day
  //   if (!map[dateKey] || new Date(map[dateKey].date) > dateObj) {
  //     map[dateKey] = record;
  //   }
  // }

  // // Build result with missing days filled
  // let current = new Date(from);
  // const end = new Date(to);
  // const result = [];

  // while (current <= end) {
  //   const iso = current.toISOString();
  //   const key = iso.slice(0, 10);

  //   result.push(map[key] ?? { date: iso, value: 0 });

  //   current.setUTCDate(current.getUTCDate() + 1);
  // }
  return result;
}

//as per Adasta requirements
function getRecordsPerDay(records) {
  //ChatGPT optimize code
  const map = {};
  let minTime = Infinity;
  let maxTime = -Infinity;

  for (const r of records) {
    const time = Date.parse(r.date); // number
    const dayKey = r.date.slice(0, 10); // YYYY-MM-DD

    // track range
    if (time < minTime) minTime = time;
    if (time > maxTime) maxTime = time;

    if (!map[dayKey]) {
      map[dayKey] = [];
    }
    map[dayKey].push(r);
  }
  const result = [];
  let current = new Date(minTime);
  const end = new Date(maxTime);
  while (current <= end) {
    const iso = current.toISOString();
    const key = iso.slice(0, 10);

    if (map[key]) {
      result.push(...map[key]);
    } else {
      result.push({ date: iso, value: 0 });
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return result;
}
