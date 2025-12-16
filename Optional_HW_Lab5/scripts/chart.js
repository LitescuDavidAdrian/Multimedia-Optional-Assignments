window.onload = function () {

    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');

    const width = canvas.width;
    const height = canvas.height;

    const xIncrement = 150;
    const yIncrement = 100;
    const valueIncrement = 20;
    const textOffset = 5;

    let intervalId;
    let isRunning = true;
    let updateSpeed = 1000;
    let maxValue = height;
    let showGrid = true;

    const minDelay = 200;   // fastest
    const maxDelay = 2000; // slowest

    const series = [
        { data: [], color: 'green' },
        { data: [], color: 'red' },
        { data: [], color: 'blue' }
    ];

    /* ---------------- GRID ---------------- */

    function drawVerticalLines() {
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;

        for (let i = 0; i < width; i += xIncrement) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
        }
    }

    function drawHorizontalLines() {
        ctx.strokeStyle = 'gray';
        ctx.lineWidth = 1;

        for (let i = 0; i < height; i += yIncrement) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
    }

    /* ---------------- LABELS ---------------- */

    function drawVerticalLabels() {
        ctx.fillStyle = 'black';

        for (let i = 0; i < height; i += yIncrement) {
            let value = Math.round(maxValue - (i / height) * maxValue);
            ctx.fillText(value, textOffset, i + 2 * textOffset);
        }
    }

    function drawHorizontalLabels() {
        ctx.fillStyle = 'black';

        for (let i = 0; i < width; i += xIncrement) {
            ctx.fillText(i, i + textOffset, height - textOffset);
        }
    }

    /* ---------------- CHART ---------------- */

    // Chart type state
    let chartType = 'line'; // 'line' | 'area' | 'bar' | 'scatter'

    function renderLine(s) {
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, height - s.data[0]);

        for (let i = 1; i < s.data.length; i++) {
            let xPrev = (i - 1) * valueIncrement;
            let yPrev = height - s.data[i - 1];

            let xCurr = i * valueIncrement;
            let yCurr = height - s.data[i];

            let controlX = (xPrev + xCurr) / 2;

            ctx.bezierCurveTo(
                controlX, yPrev,
                controlX, yCurr,
                xCurr, yCurr
            );
        }
        ctx.stroke();
    }

    function renderArea(s) {
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.moveTo(0, height - s.data[0]);

        for (let i = 1; i < s.data.length; i++) {
            let xPrev = (i - 1) * valueIncrement;
            let yPrev = height - s.data[i - 1];

            let xCurr = i * valueIncrement;
            let yCurr = height - s.data[i];

            let controlX = (xPrev + xCurr) / 2;

            ctx.bezierCurveTo(
                controlX, yPrev,
                controlX, yCurr,
                xCurr, yCurr
            );
        }
        ctx.lineTo((s.data.length - 1) * valueIncrement, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        ctx.globalAlpha = 0.18;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.strokeStyle = s.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, height - s.data[0]);
        for (let i = 1; i < s.data.length; i++) {
            let xPrev = (i - 1) * valueIncrement;
            let yPrev = height - s.data[i - 1];

            let xCurr = i * valueIncrement;
            let yCurr = height - s.data[i];

            let controlX = (xPrev + xCurr) / 2;

            ctx.bezierCurveTo(
                controlX, yPrev,
                controlX, yCurr,
                xCurr, yCurr
            );
        }
        ctx.stroke();
    }

    function renderBar(allSeries) {
        const barBase = valueIncrement * 0.8; // total group width
        const barWidth = barBase / allSeries.length;

        for (let si = 0; si < allSeries.length; si++) {
            const s = allSeries[si];
            for (let i = 0; i < s.data.length; i++) {
                const x = i * valueIncrement - barBase / 2 + si * barWidth + (valueIncrement / 2);
                const y = height - s.data[i];
                const h = s.data[i];

                ctx.fillStyle = s.color;
                ctx.fillRect(x - barWidth / 2, y, barWidth, h);
            }
        }
    }

    function renderScatter(s) {
        ctx.fillStyle = s.color;
        for (let i = 0; i < s.data.length; i++) {
            const x = i * valueIncrement;
            const y = height - s.data[i];
            ctx.beginPath();
            ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function drawChart() {
        switch (chartType) {
            case 'line':
                series.forEach(renderLine);
                break;
            case 'area':
                series.forEach(renderArea);
                break;
            case 'bar':
                renderBar(series);
                break;
            case 'scatter':
                series.forEach(renderScatter);
                break;
        }
    }

    /* ---------------- DATA ---------------- */

    function generateRandomNumber() {
        return Math.floor(Math.random() * maxValue);
    }

    function generateData() {
        series.forEach(s => {
            s.data = [];
            for (let i = 0; i <= width; i += valueIncrement) {
                s.data.push(generateRandomNumber());
            }
        });
    }

    function generateNewValue() {
        series.forEach(s => {
            s.data.push(generateRandomNumber());
            s.data.shift();
        });
    }

    /* ---------------- RENDER ---------------- */

    let hoveredIndex = null;
    let hoveredSeries = null;
    let mouseX = null;
    let mouseY = null;
    const hoverThreshold = 30; // pixels

    function showTooltip(x, y, html) {
        const tooltip = document.getElementById('tooltip');
        const containerRect = canvas.getBoundingClientRect();
        tooltip.style.left = Math.min(Math.max(x + 10, 0), width - 10) + 'px';
        tooltip.style.top = Math.min(Math.max(y - 50, 0), height - 10) + 'px';

        document.getElementById('tooltip-content').innerHTML = html;
        tooltip.style.display = 'block';
    }

    function hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'none';
    }

    canvas.addEventListener('mousemove', function (evt) {
        const rect = canvas.getBoundingClientRect();
        mouseX = evt.clientX - rect.left;
        mouseY = evt.clientY - rect.top;

        const idx = Math.round(mouseX / valueIncrement);
        let foundSeries = null;
        let minDist = Infinity;
        let foundX = null;

        series.forEach((s, si) => {
            if (idx >= 0 && idx < s.data.length) {
                let xCoord = idx * valueIncrement;
                if (chartType === 'bar') {
                    const barBase = valueIncrement * 0.8;
                    const barWidth = barBase / series.length;
                    xCoord = idx * valueIncrement - barBase / 2 + si * barWidth + (valueIncrement / 2);
                }

                const yValue = height - s.data[idx];
                const dist = Math.hypot(mouseX - xCoord, mouseY - yValue);
                if (dist < minDist) {
                    minDist = dist;
                    foundSeries = si;
                    foundX = xCoord;
                }
            }
        });

        if (foundSeries !== null && minDist < hoverThreshold) {
            hoveredIndex = idx;
            hoveredSeries = foundSeries;

            const s = series[hoveredSeries];
            const value = s.data[hoveredIndex];
            const pointX = foundX !== null ? foundX : (hoveredIndex * valueIncrement);
            const pointY = height - value;

            showTooltip(pointX, pointY, `<strong style="color:${s.color}">Series ${hoveredSeries + 1}</strong><br>Value: <strong>${value}</strong><br><small>Index: ${hoveredIndex}</small>`);
        } else {
            hoveredIndex = null;
            hoveredSeries = null;
            hideTooltip();
        }

        draw();
    });

    canvas.addEventListener('mouseout', function () {
        hoveredIndex = null;
        hoveredSeries = null;
        mouseX = null;
        mouseY = null;
        hideTooltip();
        draw();
    });

    function draw() {
        ctx.clearRect(0, 0, width, height);

        if (showGrid) {
            drawVerticalLines();
            drawHorizontalLines();
        }

        drawVerticalLabels();
        drawHorizontalLabels();
        drawChart();

        if (hoveredIndex !== null && hoveredSeries !== null && mouseX !== null && mouseY !== null) {
            const s = series[hoveredSeries];
            const value = s.data[hoveredIndex];
            let px;
            if (chartType === 'bar') {
                const barBase = valueIncrement * 0.8;
                const barWidth = barBase / series.length;
                px = hoveredIndex * valueIncrement - barBase / 2 + hoveredSeries * barWidth + (valueIncrement / 2);
            } else {
                px = hoveredIndex * valueIncrement;
            }
            const py = height - value;
            const dist = Math.hypot(mouseX - px, mouseY - py);
            if (dist > hoverThreshold) {
                hoveredIndex = null;
                hoveredSeries = null;
                hideTooltip();
            }
        }

        if (hoveredIndex !== null && hoveredSeries !== null) {
            const s = series[hoveredSeries];
            const value = s.data[hoveredIndex];
            let x;
            if (chartType === 'bar') {
                const barBase = valueIncrement * 0.8;
                const barWidth = barBase / series.length;
                x = hoveredIndex * valueIncrement - barBase / 2 + hoveredSeries * barWidth + (valueIncrement / 2);
            } else {
                x = hoveredIndex * valueIncrement;
            }
            const y = height - value;

            ctx.save();
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.setLineDash([5, 3]);
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
            ctx.restore();

            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#fff';
            ctx.stroke();
        }
        // update stats panel each frame
        updateStatsPanel();
    }

    /* ---------------- STATISTICS ---------------- */
    function computeStatsForSeries(s) {
        if (!s || !s.data || s.data.length === 0) {
            return { current: 0, min: 0, max: 0, avg: 0, trend: '→', trendClass: 'text-muted' };
        }
        const len = s.data.length;
        const current = s.data[len - 1];
        const prev = len >= 2 ? s.data[len - 2] : current;
        const min = Math.min(...s.data);
        const max = Math.max(...s.data);
        const avg = Math.round(s.data.reduce((a, b) => a + b, 0) / len);
        let trend = '→', trendClass = 'text-muted';
        if (current > prev) { trend = '↑'; trendClass = 'text-success'; }
        else if (current < prev) { trend = '↓'; trendClass = 'text-danger'; }
        return { current, min, max, avg, trend, trendClass };
    }

    function updateStatsPanel() {
        const container = document.getElementById('stats-content');
        if (!container) return;
        let html = '';
        series.forEach((s, i) => {
            const st = computeStatsForSeries(s);
            const highlight = (hoveredSeries === i) ? 'highlight' : '';
            html += `<div class="series-row ${highlight}" data-series="${i}">
                <div style="display:flex; align-items:center;">
                    <span class="series-badge" style="background:${s.color}"></span>
                    <span class="series-name">Series ${i + 1}</span>
                </div>
                <div class="stat-values">
                    <div>Current: <strong>${st.current}</strong> <span class="${st.trendClass}">${st.trend}</span></div>
                    <div><small>min: ${st.min} • max: ${st.max} • avg: ${st.avg}</small></div>
                </div>
            </div>`;
        });
        container.innerHTML = html;

        container.querySelectorAll('.series-row').forEach(row => {
            row.onclick = function () {
                const idx = Number(this.getAttribute('data-series'));
                hoveredSeries = idx;
                hoveredIndex = series[idx].data.length - 1;
                draw();
            };
        });
    }

    /* ---------------- ANIMATION ---------------- */

    function startAnimation() {
        intervalId = setInterval(() => {
            generateNewValue();
            draw();
        }, updateSpeed);
    }

    function stopAnimation() {
        clearInterval(intervalId);
    }

    /* ---------------- INIT ---------------- */

    generateData();
    draw();
    startAnimation();

    /* ---------------- CONTROLS ---------------- */

    document.getElementById('toggleBtn').onclick = function () {
        if (isRunning) {
            stopAnimation();
            this.textContent = 'Start';
        } else {
            startAnimation();
            this.textContent = 'Pause';
        }
        isRunning = !isRunning;
    };

    document.getElementById('resetBtn').onclick = function () {
        generateData();
        draw();
    };

    document.getElementById('speedSlider').oninput = function () {
        const speed = Number(this.value);

        updateSpeed = maxDelay - ((speed - 1) / 9) * (maxDelay - minDelay);

        if (isRunning) {
            stopAnimation();
            startAnimation();
        }
    };


    document.getElementById('maxValueInput').onchange = function () {
        maxValue = Number(this.value);
    };

    document.getElementById('gridToggle').onchange = function () {
        showGrid = this.checked;
        draw();
    };

    function setChartType(type) {
        chartType = type;
        ['line', 'area', 'bar', 'scatter'].forEach(t => {
            const btn = document.getElementById('type-' + t);
            if (btn) btn.classList.toggle('active', t === type);
        });
        draw();
    }

    const typeButtons = ['line', 'area', 'bar', 'scatter'];
    typeButtons.forEach(t => {
        const btn = document.getElementById('type-' + t);
        if (btn) btn.addEventListener('click', () => setChartType(t));
    });

    setChartType(chartType);
};
