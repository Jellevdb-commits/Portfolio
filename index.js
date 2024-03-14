document.addEventListener("DOMContentLoaded", function() {
    // Scroll to top when page is loading
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }

    const baseContainer = document.getElementById('circles-container');
    const startButton = document.getElementById('start-button');
    const starDiv = document.getElementById('starDiv');
    const landing = document.getElementById('landing');
    const about = document.getElementById('about');
    const title = document.getElementById('title');

    // Function, gradient middle point follows cursor
    function MouseFollowTitleGradient(e){
        const x = e.clientX / window.innerWidth * 100;
        const y = e.clientY / window.innerHeight * 100;
    
        const gradient = `radial-gradient(circle at ${x}% ${y}%, #fefefe 0%, #00a4e4 100%)`;
    
        document.querySelector('.name').style.backgroundImage = gradient;
    }

    document.addEventListener('mousemove', function(e) {
        MouseFollowTitleGradient(e)
    });


    let baseDiameter = 800; // Starting size for the largest circle
    const decrement = 30; // Smaller decrement for more gradual size reduction
    const baseDots = 50; // Starting number of dots
    const totalCircles = 50; // Total number of circles
    const baseDuration = 120; // Base duration for the smallest circle's rotation

    function createCircles() {
        while (baseContainer.firstChild) {
            baseContainer.removeChild(baseContainer.firstChild);
        }

        let currentContainer = baseContainer;

        for (let j = 0; j < totalCircles; j++) {
            const circle = document.createElement('div');
            circle.classList.add('circle');
            const diameter = baseDiameter - (decrement * j);
            circle.style.width = `${diameter}px`;
            circle.style.height = `${diameter}px`;

            const animationDuration = baseDuration - (j * 2);
            circle.style.animation = `rotate ${Math.max(animationDuration, 10)}s linear infinite`;

            const numberOfDots = baseDots - (2 * j);
            const baseRadius = diameter / 2;

            for (let i = 0; i < numberOfDots; i++) {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                const randomFactor = Math.random() * 0.1 - 0.05; // Random factor between -0.05 and 0.05
                const distortedRadius = baseRadius * (1 + randomFactor); // Apply random factor to base radius

                const angle = (i / numberOfDots) * (2 * Math.PI);
                const x = distortedRadius * Math.cos(angle) + baseRadius - 2.5; // Adjust for dot size
                const y = distortedRadius * Math.sin(angle) + baseRadius - 2.5;
                dot.style.left = `${x}px`;
                dot.style.top = `${y}px`;
                circle.appendChild(dot);
            }

            currentContainer.appendChild(circle);
            currentContainer = circle; // Nest the next circle within the current one
        }
    }

    createCircles(); // Initial creation of circles

    function calcCenter() {
        let center = document.createElement("div");
        center.setAttribute("class", "center");
        center.style.top = "50%";
        center.style.left = "50%";
        center.style.transform = "translate(-50%, -50%)";
        starDiv.appendChild(center);
    }

    function calcAngle(p1, p2) {
        var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        return radToDegree(angle);
    }

    function radToDegree(rad) {
        return ((rad > 0 ? rad : (2 * Math.PI + rad)) * 360) / (2 * Math.PI);
    }

    let scw, sch, scx, scy, centerBounds = 1; // Initialize centerBounds here
    function updateWindowSize() {
        sch = window.innerHeight;
        scw = window.innerWidth;
        scx = scw / 2;
        scy = sch / 2;
    }
    updateWindowSize(); // Initialize window size

    // Update window size on resize
    window.addEventListener('resize', updateWindowSize);

    document.getElementById('start-button').addEventListener('click', function handleClick() {

        calcCenter();

        for (let i = 0; i < 100; i++) {
            let div = document.createElement("div");
            let top = Math.floor(Math.random() * sch);
            let left = Math.floor(Math.random() * scw);
            let angle = calcAngle({ x: left, y: top }, { x: scx, y: scy });
            div.setAttribute("class", "star");
            div.style.top = top + "px";
            div.style.left = left + "px";
            div.style.transform = "rotate(" + (angle + 180) + "deg)";
            if (
                // No star streaks on central path
                top >= scy - centerBounds &&
                top <= scy + centerBounds &&
                left >= scx - centerBounds &&
                left <= scx + centerBounds
            ) {
                div.style.maxWidth = "1px";
            }
            starDiv.appendChild(div);
        }

        document.querySelectorAll('.star:nth-child(2n)').forEach(star => {
            star.classList.add('lightspeed-animation');
        });

        document.querySelectorAll('.code-staircase pre code').forEach(function(codeBlock) {
            codeBlock.style.borderRight = '.15em solid white';
        });
        baseContainer.style.transition = 'transform .5s ease, opacity .5s ease';
        baseContainer.style.transform = `scale(2)`;
        baseContainer.style.opacity = 0;

        this.style.transition = 'transform .5s ease, opacity .5s ease';
        this.style.transform = `scale(2)`;
        this.style.opacity = 0;

        title.style.transition = 'transform .5s ease, opacity .5s ease';
        title.style.transform = `translate(-50%, -50%) scale(2)`;
        title.style.opacity = 0;

    });
    document.body.addEventListener('animationend', function(event) {
        if (event.target.className.includes('star')) {
            landing.style.display = 'none';
            about.style.display = 'block';
            starDiv.innerHTML = '';
            startButton.style.opacity = 1;
            startButton.style.transform = `scale(1)`;
            document.querySelectorAll('.star:nth-child(2n)').forEach(star => {
                star.classList.remove('lightspeed-animation');
            });
            document.querySelectorAll('.code-staircase pre code').forEach(function(codeBlock) {
                codeBlock.classList.add('type-animation');
            });
        }
        if (event.target.tagName === 'CODE' && event.target.parentNode.tagName === 'PRE' && event.target.closest('.code-staircase')) {
            document.querySelectorAll('.code-staircase pre code').forEach(function(codeBlock) {
                codeBlock.style.borderRight = 'none';
            });
        }
    });

    document.querySelector('.back-button.about-back').addEventListener('click', function() {
        PrevPage('about', 'landing', true);
    });

    document.querySelector('.next-button.about-next').addEventListener('click', function() {
        NextPage('about', 'projects', false);
    });

      function  NextPage (currentPageId, nextPageId){
        const currentPage = document.getElementById(`${currentPageId}`);
        const nextPage = document.getElementById(`${nextPageId}`);

        nextPage.style.display = 'block';
        currentPage.style.display = 'none';
      }

      function PrevPage (currentPageId, prevPageId, isLanding) {
        const currentPage = document.getElementById(`${currentPageId}`);
        const prevPage = document.getElementById(`${prevPageId}`);
        const goToLanding = isLanding;


        currentPage.classList.add('fadeout')

        document.body.addEventListener('animationend', function(event) {
            if (event.target.className.includes(`about`) && event.target.className.includes('fadeout') && currentPage.style.display === 'block') {
                currentPage.style.display = 'none';
                currentPage.classList.remove('fadeout');
                prevPage.style.display = 'block';
            }
        });



        if (goToLanding) {
            baseContainer.style.transition = 'transform .5s ease, opacity .5s ease';
            baseContainer.style.transform = `scale(1)`;
            baseContainer.style.opacity = 1;
    
            title.style.transition = 'transform .5s ease, opacity .5s ease';
            title.style.transform = `translate(-50%, -50%) scale(1)`;
            title.style.opacity = 1;
            startButton.style.transition = 'all 700ms ease';
        }
      }
});