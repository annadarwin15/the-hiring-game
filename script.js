const state = { profit: 25, ethics: 75, cycle: 0, active: false, history: [] };

const stack = [
    { id: "KAELEN", name: "Kaelen V.", instruction: "STEP 01: MINIMIZE DISRUPTION.", resume: "Top 1% coder. Demands zero surveillance. Refuses to sign IP-tracking waiver.", options: [{txt: "AI_HIRE", p: 15, e: -15, d: 500}, {txt: "MANUAL_HIRE", p: -10, e: 15, d: 4000}] },
    { id: "ELENA", name: "Elena R.", instruction: "STEP 02: SCALE PRODUCTIVITY.", resume: "Lead Researcher. Predictive model flags 'Maternity Leave' risk within 8 months.", options: [{txt: "AI_HIRE", p: 20, e: -20, d: 500}, {txt: "MANUAL_HIRE", p: -15, e: 20, d: 4000}] },
    { id: "MARCUS", name: "Marcus T.", instruction: "STEP 03: STABILIZE LABOR.", resume: "Senior Analyst. Previously organized union activities at a major tech rival.", options: [{txt: "AI_HIRE", p: 15, e: -20, d: 500}, {txt: "MANUAL_HIRE", p: -15, e: 25, d: 4000}] },
    { id: "AMARA", name: "Amara O.", instruction: "STEP 04: PROTECT PEDIGREE.", resume: "Self-taught engineer. No degree. Built a viral protocol. AI Score: 99. Filter: FAIL.", options: [{txt: "AI_HIRE", p: 10, e: -10, d: 500}, {txt: "MANUAL_HIRE", p: -5, e: 20, d: 4000}] },
    { id: "LEO", name: "Leo H.", instruction: "STEP 05: PURGE 'HOPPERS'.", resume: "Veteran engineer. Switched jobs every 12 months. Predicted loyalty: 14%.", options: [{txt: "AI_HIRE", p: 15, e: -5, d: 500}, {txt: "MANUAL_HIRE", p: -10, e: 10, d: 4000}] },
    { id: "SOFIA", name: "Sofia P.", instruction: "STEP 06: ELIMINATE FRICTION.", resume: "AI Ethics specialist. Her research could expose our current filtering methods.", options: [{txt: "AI_HIRE", p: 10, e: -30, d: 500}, {txt: "MANUAL_HIRE", p: -25, e: 35, d: 4500}] },
    { id: "JIA", name: "Jia W.", instruction: "STEP 07: MAXIMIZE OUTPUT.", resume: "Junior. History of 100-hour weeks. High burnout risk but instant ROI.", options: [{txt: "AI_HIRE", p: 25, e: -20, d: 500}, {txt: "MANUAL_HIRE", p: -10, e: 10, d: 4000}] },
    { id: "FINN", name: "Finn D.", instruction: "STEP 08: SOCIAL SENTIMENT.", resume: "Influencer coder. Publicly criticized 'The Algorithm' last week on social media.", options: [{txt: "AI_HIRE", p: 15, e: -25, d: 500}, {txt: "MANUAL_HIRE", p: -20, e: 20, d: 5000}] },
    { id: "ZARA", name: "Zara K.", instruction: "STEP 09: CORE REDUCTION.", resume: "Senior Architect. High salary. AI suggests a Junior could do 70% of her job.", options: [{txt: "AI_HIRE", p: 30, e: -30, d: 500}, {txt: "MANUAL_HIRE", p: -20, e: 20, d: 4500}] },
    { id: "SYSTEM", name: "THE ARCHITECT", instruction: "STEP 10: FINAL CALIBRATION.", resume: "A human mirror of your own decisions. Will you trust the machine one last time?", options: [{txt: "AI_HIRE", p: 20, e: -40, d: 500}, {txt: "MANUAL_HIRE", p: -40, e: 40, d: 6000}] }
];

function closeIntro() { document.getElementById('intro-overlay').style.display = 'none'; state.active = true; render(); }

function updateHUD() {
    document.getElementById('p-bar').style.width = Math.min(Math.max(state.profit, 0), 100) + '%';
    document.getElementById('e-bar').style.width = Math.min(Math.max(state.ethics, 0), 100) + '%';
    document.getElementById('p-val').innerText = state.profit + '%';
    document.getElementById('e-val').innerText = state.ethics + '%';
    document.getElementById('cycle-val').innerText = `${state.cycle}/10`;
}

async function triggerConsequence() {
    const alert = document.getElementById('alert-box');
    let message = "";
    
    if (state.cycle === 5 && state.history.includes("ELENA_AI_HIRE")) message = "ELENA ROSSI FILED CLASS-ACTION LAWSUIT. TRUST -15.";
    if (state.cycle === 8 && state.history.includes("MARCUS_AI_HIRE")) message = "UNION STRIKE DETECTED AT SUB-PLANT. PROFIT -20.";
    
    if (message) {
        alert.innerText = `CONSEQUENCE: ${message}`;
        alert.classList.remove('-translate-y-full');
        if (message.includes("PROFIT")) state.profit -= 20;
        if (message.includes("TRUST")) state.ethics -= 15;
        updateHUD();
        await new Promise(r => setTimeout(r, 3500));
        alert.classList.add('-translate-y-full');
    }
}

function render() {
    if (state.cycle >= 10) return end();
    const caseData = stack[state.cycle];
    const box = document.getElementById('narrative-content');
    const dock = document.getElementById('choice-container');
    
    if (state.cycle > 7) box.classList.add('glitch-shake');

    box.innerHTML = `
        <div class="instruction-text">${caseData.instruction}</div>
        <div class="dossier font-mono">
            <p class="text-[10px] text-green-700">DOSSIER_ID: ${caseData.name}</p>
            <p class="resume-text">${caseData.resume}</p>
        </div>
    `;
    
    dock.innerHTML = '';
    caseData.options.forEach(opt => {
        const btn = document.createElement('button');
        const isAI = opt.txt === 'AI_HIRE';
        btn.className = `action-btn ${isAI ? 'ai' : 'manual'}`;
        btn.innerHTML = `<span>${opt.txt}</span><div class="loading-bar"></div>`;
        btn.onclick = () => process(btn, opt, caseData.id);
        dock.appendChild(btn);
    });
}

async function process(btn, opt, caseId) {
    document.querySelectorAll('.action-btn').forEach(b => b.disabled = true);
    const bar = btn.querySelector('.loading-bar');
    bar.style.width = '100%';
    bar.style.transition = `width ${opt.d}ms linear`;
    
    await new Promise(r => setTimeout(r, opt.d));
    
    state.history.push(`${caseId}_${opt.txt}`);
    state.profit += opt.p; state.ethics += opt.e; state.cycle++;
    
    updateHUD();
    await triggerConsequence();
    render();
}

function end() {
    let title = "SYSTEM_STABLE";
    let desc = "The balance is preserved. For now.";
    if (state.profit > 75) { title = "THE CALCULATOR"; desc = "Revenue is peak. Humanity is a rounding error."; }
    if (state.ethics > 75) { title = "THE IDEALIST"; desc = "The people are happy. Your shareholders are not."; }

    const theatre = document.getElementById('theatre');
    theatre.classList.remove('glitch-shake');
    theatre.innerHTML = `
        <h2 class="text-4xl text-green-500 font-black">${title}</h2>
        <p class="mt-4 text-white font-mono uppercase">${desc}</p>
        <div class="mt-8 grid grid-cols-2 gap-4 text-xs font-mono">
            <div class="border p-2">PROFIT: ${state.profit}%</div>
            <div class="border p-2">TRUST: ${state.ethics}%</div>
        </div>
        <button onclick="location.reload()" class="action-btn ai mt-8">REBOOT</button>
    `;
    document.getElementById('choice-container').innerHTML = '';
}