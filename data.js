// All data below is invented for the demo. Any resemblance to real people or societies is coincidental.
window.DEMO = {
  society: "Sunrise Heights CHS",
  member: { name: "Ananya Sharma", flat: "A-402" },
  stages: ["open", "pending", "closed", "verified", "approved"],
  stageLabel: { open: "Open", pending: "Work in progress", closed: "Closed by member", verified: "Verified by manager", approved: "Approved by secretary" },
  complaints: [
    { id: "SH-1042", flat: "A-402", by: "Ananya Sharma", cat: "Plumbing", title: "Kitchen sink leaking under the cabinet", stage: "pending", vendor: "Patil Plumbing Works", attach: "photo", log: [["open", "14 Oct, 9:12 am"], ["pending", "14 Oct, 11:40 am"]] },
    { id: "SH-1038", flat: "A-402", by: "Ananya Sharma", cat: "Electrical", title: "Corridor light outside A-402 flickering", stage: "closed", vendor: "Shree Electricals", attach: "photo", log: [["open", "9 Oct, 7:05 pm"], ["pending", "10 Oct, 10:15 am"], ["closed", "11 Oct, 6:30 pm"]] },
    { id: "SH-1035", flat: "B-1103", by: "Rohan Deshmukh", cat: "Lift", title: "Lift B stops between 7th and 8th floor", stage: "verified", vendor: "Kalyan Lift Services", attach: "pdf", log: [["open", "5 Oct, 8:20 am"], ["pending", "5 Oct, 9:00 am"], ["closed", "7 Oct, 5:45 pm"], ["verified", "8 Oct, 11:10 am"]] },
    { id: "SH-1029", flat: "C-204", by: "Fatima Qureshi", cat: "Housekeeping", title: "Stairwell C not swept for two days", stage: "approved", vendor: "CleanNest Facility", attach: null, log: [["open", "28 Sep, 8:00 am"], ["pending", "28 Sep, 9:30 am"], ["closed", "29 Sep, 1:00 pm"], ["verified", "29 Sep, 4:00 pm"], ["approved", "30 Sep, 10:20 am"]] },
    { id: "SH-1044", flat: "B-702", by: "Vikram Nair", cat: "Security", title: "CCTV camera at gate 2 not recording", stage: "open", vendor: "—", attach: "photo", log: [["open", "17 Oct, 10:45 pm"]] },
    { id: "SH-1040", flat: "C-901", by: "Meera Iyer", cat: "Water", title: "Low water pressure on top floors", stage: "pending", vendor: "Patil Plumbing Works", attach: null, log: [["open", "12 Oct, 6:10 am"], ["pending", "12 Oct, 12:00 pm"]] }
  ],
  notices: [
    { date: "18 Oct 2026", title: "Water tank cleaning on Sunday 25 Oct", body: "Water supply will be off from 10 am to 2 pm. Please store water the night before.", sent: 248, delivered: 241, read: 196 },
    { date: "12 Oct 2026", title: "Diwali decoration guidelines", body: "Lights on balconies are welcome. Please avoid open flames in common corridors.", sent: 248, delivered: 246, read: 221 },
    { date: "2 Oct 2026", title: "AGM on 8 November, 6 pm, clubhouse", body: "Agenda and last year's minutes are in the document library.", sent: 248, delivered: 244, read: 230 }
  ],
  documents: [
    { cat: "Receipts", title: "Maintenance receipt · Oct 2026 · A-402", size: "84 KB" },
    { cat: "Receipts", title: "Maintenance receipt · Sep 2026 · A-402", size: "83 KB" },
    { cat: "Bye-laws", title: "Society bye-laws (sample edition)", size: "1.2 MB" },
    { cat: "AGM minutes", title: "AGM minutes · 2025", size: "410 KB" },
    { cat: "Notices", title: "Water tank cleaning notice", size: "60 KB" },
    { cat: "Circulars", title: "Parking stickers renewal circular", size: "92 KB" }
  ],
  vendors: [
    { name: "Patil Plumbing Works", type: "Plumber", rating: 4.6, verified: true, phone: "+91 90000 00101", jobs: 18 },
    { name: "Shree Electricals", type: "Electrician", rating: 4.4, verified: true, phone: "+91 90000 00102", jobs: 11 },
    { name: "CoolAir A/C Care", type: "A/C technician", rating: 4.1, verified: true, phone: "+91 90000 00103", jobs: 7 },
    { name: "Sunita Pawar", type: "Domestic help", rating: 4.8, verified: true, phone: "+91 90000 00104", jobs: 0 },
    { name: "Glow Home Salon", type: "Beautician", rating: 4.3, verified: false, phone: "+91 90000 00105", jobs: 0 },
    { name: "FixIt Handyman", type: "Handyman", rating: 3.9, verified: true, phone: "+91 90000 00106", jobs: 9 }
  ],
  nocs: [
    { id: "NOC-221", flat: "A-402", by: "Ananya Sharma", type: "Bank NOC (home loan)", stage: "With secretary", date: "16 Oct 2026" },
    { id: "NOC-219", flat: "B-304", by: "Arjun Mehta", type: "Move-out NOC", stage: "Approved", date: "10 Oct 2026" },
    { id: "NOC-223", flat: "C-1202", by: "Kavya Reddy", type: "Move-in NOC (tenant)", stage: "With secretary", date: "18 Oct 2026" }
  ],
  amc: [
    { vendor: "Kalyan Lift Services", service: "Lift AMC (3 lifts)", value: "₹2.4 lakh", expiry: "25 Oct 2026", days: 7 },
    { vendor: "SafeGuard Fire Systems", service: "Fire safety AMC", value: "₹85,000", expiry: "18 Nov 2026", days: 30 },
    { vendor: "AquaPure Systems", service: "Water purifier AMC", value: "₹42,000", expiry: "17 Dec 2026", days: 60 },
    { vendor: "CleanNest Facility", service: "Housekeeping contract", value: "₹6.6 lakh", expiry: "31 Mar 2027", days: 164 }
  ],
  emails: {
    "lift repairs since 2024": {
      summary: "Lift B has needed repairs four times since 2024. Kalyan Lift Services replaced the door sensor in March 2024 and the controller board in January 2025 (₹68,000, paid from the repair fund). The AMC was renewed in October 2025 with a 4-hour response clause.",
      sources: ["Re: Lift B door sensor — Kalyan Lift Services, 12 Mar 2024", "Quotation: controller board replacement, 8 Jan 2025", "AMC renewal 2025–26 signed copy, 20 Oct 2025"]
    },
    "water tank cleaning vendor": {
      summary: "Tanks were cleaned every six months by AquaPure Systems. The last cleaning was in April 2026; the committee approved the October date on 15 Oct 2026.",
      sources: ["Tank cleaning report — AquaPure, 22 Apr 2026", "MC minutes extract, 15 Oct 2026"]
    }
  },
  emergency: [["Security desk (24×7)", "+91 90000 00911"], ["Society manager", "+91 90000 00201"], ["Lift emergency (AMC)", "+91 90000 00301"], ["Fire brigade", "101"], ["Ambulance", "108"], ["Police", "112"]]
};
