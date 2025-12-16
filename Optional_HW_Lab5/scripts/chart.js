window.onload = function () {
    let canvas = document.getElementById('chartCanvas');
    let context = canvas.getContext('2d');

    let width = canvas.width;
    let height = canvas.height;

    let xIncrement = 150;
    let yIncrement = 100;
    let valueIncrement = 20;
    let textOffset = 5;

    let series = [
        { data: [], color: 'green' },
        { data: [], color: 'red' },
        { data: [], color: 'blue' }
    ];

    function drawVerticalLines() {
        context.strokeStyle = 'gray';
        context.lineWidth = 1;

        for (let i = 0; i < width; i += xIncrement) {
            context.beginPath();
            context.moveTo(i, 0);
            context.lineTo(i, height);
            context.stroke();
        }
    }

    function drawHorizontalLines() {
        context.strokeStyle = 'gray';
        context.lineWidth = 1;

        for (let i = 0; i < height; i += yIncrement) {
            context.beginPath();
            context.moveTo(0, i);
            context.lineTo(width, i);
            context.stroke();
        }
    }

    function drawChart() {
        series.forEach(s => {
            context.strokeStyle = s.color;
            context.lineWidth = 4;

            context.beginPath();
            context.moveTo(0, height - s.data[0]);

            for (let i = 1; i < s.data.length; i++) {
                context.lineTo(i * valueIncrement, height - s.data[i]);
            }

            context.stroke();
        });
    }

    function drawVerticalLabels() {
        context.fillStyle = 'black';
        for (let i = 0; i < height; i += yIncrement) {
            context.fillText(height - i, textOffset, i + 2 * textOffset);
        }
    }

    function drawHorizontalLabels() {
        context.fillStyle = 'black';
        for (let i = 0; i < width; i += xIncrement) {
            context.fillText(i, i + textOffset, height - textOffset);
        }
    }

    function generateRandomNumber() {
        return parseInt(Math.random() * height);
    }

    function generateData() {
        series.forEach(s => {
            s.data = [];
            for (let i = 0; i <= width; i += valueIncrement) {
                s.data.push(generateRandomNumber());
            }
        });
    }

    function draw() {
        context.clearRect(0, 0, width, height);
        drawVerticalLines();
        drawHorizontalLines();
        drawVerticalLabels();
        drawHorizontalLabels();
        drawChart();
    }

    function generateNewValue() {
        series.forEach(s => {
            s.data.push(generateRandomNumber());
            s.data.shift();
        });
    }

    setInterval(function () {
        generateNewValue();
        draw();
    }, 1000)

    generateData();
    draw();
}