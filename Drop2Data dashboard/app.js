console.log("APP JS CONNECTED");


// WATER STORY
const todayUsage = 120;
const usualUsage = 130;
const story = document.getElementById("waterStory");
story.innerHTML = todayUsage<usualUsage
  ? `💧 Today, your home used <b>${todayUsage}L</b> — <span style="color:#16a34a">${usualUsage-todayUsage}L less</span> than usual. Great job!`
  : `💧 Today, your home used <b>${todayUsage}L</b>. Try saving more tomorrow!`;

// CHART.JS
const ctx = document.getElementById('usageChart').getContext('2d');
new Chart(ctx,{
  type:'bar',
  data:{
    labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    datasets:[
      { label:'Usage (L)', data:[70,55,60,45,50,48,40], backgroundColor:'#4a6681'},
      { label:'Safe Limit', type:'line', data:[60,60,60,60,60,60,60], borderColor:'#e49ac3', borderWidth:2, fill:false, pointRadius:0, tension:0.3 }
    ]
  },
  options:{ responsive:true, scales:{ y:{beginAtZero:true,title:{display:true,text:'Liters'}}, x:{title:{display:true,text:'Days'}}}}

});
// ECO PLANT
const plant = document.getElementById("plant");
const ecoScore = 78;
plant.textContent=ecoScore<50?"🥀":ecoScore<80?"🌱":"🌳";
async function loadSuggestions() {
  try {
    const response = await fetch('http://localhost:5000/api/suggestions');
    const data = await response.json();
    data.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.Suggestion; // من Excel
      list.appendChild(li);
    });

  } catch (error) {
  }
}

// تحميل أول ما الصفحة تفتح
loadSuggestions();
document.addEventListener("DOMContentLoaded", () => {
  loadMonitoringData();
});

function loadMonitoringData() {
  fetch("http://localhost:5000/api/monitoring")
    .then(res => res.json())
    .then(rows => {

      console.log("API DATA:", rows);

      let usage, ph, turbidity;

      // نمشي على الصفوف ونجيب آخر قيمة لكل حاجة
      rows.forEach(r => {
        const param = (r.Parameter || r.parameter || r.B || "").toString().trim();
        const value = r.Value || r.value || r.C;

        if (param === "WaterCons") usage = value;
        if (param === "pH") ph = value;
        if (param === "Turbidity") turbidity = value;
      });

      // Today's usage
      if (usage !== undefined) {
        document.querySelector(".summary .card h2").textContent =
          usage + " L";
      }

      // Quality
      if (ph !== undefined && turbidity !== undefined) {
        const safe =
          ph >= 6.5 && ph <= 8.5 && turbidity <= 5;

        document.querySelector(".safe").textContent =
          safe ? "SAFE" : "CHECK";
      }

    })
    .catch(err => {
      console.error("Connection error:", err);
    });
}
