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

    function drawChart() {
        series.forEach(s => {
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
        });
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

    function draw() {
        ctx.clearRect(0, 0, width, height);

        if (showGrid) {
            drawVerticalLines();
            drawHorizontalLines();
        }

        drawVerticalLabels();
        drawHorizontalLabels();
        drawChart();
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
};
