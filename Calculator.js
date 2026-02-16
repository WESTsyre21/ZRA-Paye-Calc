function calculatePAYE() {
    // 1. Get Input Values
    const basicPay = parseFloat(document.getElementById('basicPay').value) || 0;
    const allowances = parseFloat(document.getElementById('allowances').value) || 0;
    const statutory = parseFloat(document.getElementById('statutory').value) || 0;

    // 2. Calculate Gross
    const grossPay = basicPay + allowances;

    // 3. Statutory Calculations
    // NAPSA is 5% of basic but usually capped (from ZRA, K1,342 is the cap)
    let napsa = basicPay * 0.05;
    if (napsa > 1342) napsa = 1342;

    const nhima = basicPay * 0.01; // NHIMA is 1%
    const totalContributions = napsa + nhima + statutory;

    // 4. PAYE Logic (2026 Bands from ZRA)
    let taxableIncome = Math.max(0, grossPay - napsa); // NAPSA is tax deductible

    // Variables for Table
    let band1Inc = 0, band1Tx = 0;
    let band2Inc = 0, band2Tx = 0;
    let band3Inc = 0, band3Tx = 0;
    let band4Inc = 0, band4Tx = 0;

    // Band 1: 0 - 5100 @ 0%
    if (taxableIncome > 5100) {
        band1Inc = 5100;
    } else {
        band1Inc = taxableIncome;
    }

    // Band 2: 5100 - 7100 @ 20%
    if (taxableIncome > 5100) {
        let remainder = taxableIncome - 5100;
        if (remainder > 2000) band2Inc = 2000;
        else band2Inc = remainder;

        band2Tx = band2Inc * 0.20;
    }

    // Band 3: 7100 - 9200 @ 30%
    if (taxableIncome > 7100) {
        let remainder = taxableIncome - 7100;
        if (remainder > 2100) band3Inc = 2100;
        else band3Inc = remainder;

        band3Tx = band3Inc * 0.30;
    }

    // Band 4: Above 9200 @ 37%
    if (taxableIncome > 9200) {
        band4Inc = taxableIncome - 9200;
        band4Tx = band4Inc * 0.37;
    }

    const tax = band1Tx + band2Tx + band3Tx + band4Tx;

    // 5. Totals
    const totalDeductions = tax + totalContributions;
    const netSalary = grossPay - totalDeductions;

    // 6. Update UI
    document.getElementById('grossDisplay').innerText = `K ${grossPay.toLocaleString()}`;
    document.getElementById('napsaDisplay').innerText = `K ${napsa.toFixed(2)}`;
    document.getElementById('nhimaDisplay').innerText = `K ${nhima.toFixed(2)}`;
    document.getElementById('totalContribDisplay').innerText = `K ${totalContributions.toFixed(2)}`;
    document.getElementById('payeDisplay').innerText = `K ${tax.toFixed(2)}`;
    document.getElementById('totalDeductionsDisplay').innerText = `K ${totalDeductions.toFixed(2)}`;
    document.getElementById('netSalaryDisplay').innerText = `K ${netSalary.toFixed(2)}`;

    // 7. Update Table
    document.getElementById('band1Income').innerText = band1Inc.toFixed(2);
    document.getElementById('band1Tax').innerText = band1Tx.toFixed(2);
    document.getElementById('band2Income').innerText = band2Inc.toFixed(2);
    document.getElementById('band2Tax').innerText = band2Tx.toFixed(2);
    document.getElementById('band3Income').innerText = band3Inc.toFixed(2);
    document.getElementById('band3Tax').innerText = band3Tx.toFixed(2);
    document.getElementById('band4Income').innerText = band4Inc.toFixed(2);
    document.getElementById('band4Tax').innerText = band4Tx.toFixed(2);
}

function resetForm() {
    location.reload(); // Simple way to clear everything
}

// Initialize Event Listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
    // Attach input listeners to calculate automatically
    ['basicPay', 'allowances', 'statutory'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculatePAYE);
    });

    // Dark Mode Logic
    const toggleBtn = document.getElementById('darkModeToggle');
    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        // Update button text
        if (document.body.classList.contains('dark-mode')) {
            toggleBtn.innerText = "Light Mode";
        } else {
            toggleBtn.innerText = "Dark Mode";
        }
    });
});