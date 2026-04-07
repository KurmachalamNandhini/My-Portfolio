// Wait for window load for preloader
$(window).on('load', function() {
    $('#preloader').fadeOut('slow');
    $('body').removeClass('loading');
});

$(document).ready(function() {
    // Custom Cursor
    const cursor = document.querySelector('.cursor');
    const cursor2 = document.querySelector('.cursor2');
    
    document.addEventListener('mousemove', e => {
        cursor.style.top = e.clientY + 'px';
        cursor.style.left = e.clientX + 'px';
        
        cursor2.style.top = e.clientY + 'px';
        cursor2.style.left = e.clientX + 'px';
    });

    // Add hover effect to links and buttons
    $('a, button, .project-card, .skill-card, input, textarea').hover(
        function() {
            cursor.classList.add('hovering');
            cursor2.classList.add('hovering');
        },
        function() {
            cursor.classList.remove('hovering');
            cursor2.classList.remove('hovering');
        }
    );

    // Sticky Header
    $(window).scroll(function() {
        if(this.scrollY > 20) {
            $('.navbar').parent().addClass("sticky");
        } else {
            $('.navbar').parent().removeClass("sticky");
        }
        
        // Active Link Highlighting
        let scrollY = $(window).scrollTop();
        $('section').each(function() {
            let sectionHeight = $(this).outerHeight();
            let sectionTop = $(this).offset().top - 200;
            let id = $(this).attr('id');
            
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                $('.nav-links li a').removeClass('active');
                $('.nav-links li a[href="#' + id + '"]').addClass('active');
            }
        });
    });

    // Mobile Menu Toggle
    $('.menu-btn').click(function() {
        $(this).toggleClass('active');
        $('.nav-links').toggleClass('active');
    });

    $('.nav-links li a').click(function() {
        $('.menu-btn').removeClass('active');
        $('.nav-links').removeClass('active');
    });

    // Smooth Scrolling
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        var target = this.hash;
        var $target = $(target);
        
        $('html, body').stop().animate({
            'scrollTop': $target.offset().top - 70
        }, 800, 'swing', function () {
            window.location.hash = target;
        });
    });

    // Fetch Data from JSON
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Populate Hero section & About
            $('#hero-name').text(data.personal.name);
            $('#about-bio').html(`<p>${data.personal.bio}</p>`);
            $('#contact-email').text(data.personal.email);
            $('#contact-email').attr('href', `mailto:${data.personal.email}`);

            // Social links
            if(data.personal.social.linkedin) {
                $('.social-links-hero').append(`<a href="${data.personal.social.linkedin}" target="_blank"><i class="fa-brands fa-linkedin-in"></i></a>`);
            }

            // Init Typed.js
            new Typed('.typing', {
                strings: data.personal.roles,
                typeSpeed: 100,
                backSpeed: 60,
                loop: true
            });

            // Populate Education
            const educationTimeline = $('#education-timeline');
            data.education.forEach(edu => {
                educationTimeline.append(`
                    <div class="timeline-item">
                        <div class="timeline-dot"></div>
                        <div class="timeline-content">
                            <i class="fa-solid ${edu.icon} fa-2x" style="color:var(--main-color); margin-bottom:10px;"></i>
                            <h3>${edu.degree}</h3>
                            <h4>${edu.institution}</h4>
                            <span class="date"><i class="fa-regular fa-calendar"></i> ${edu.period}</span>
                            <p>${edu.status}</p>
                        </div>
                    </div>
                `);
            });

            // Populate Skills
            const skillsContainer = $('#skills-container');
            data.skills.forEach(skill => {
                skillsContainer.append(`
                    <div class="skill-card tilt-card" data-tilt>
                        <i class="fa-brands fa-${skill.name.toLowerCase()} skill-icon"></i>
                        <div class="progress-circle" style="background: conic-gradient(${skill.color} ${skill.level * 3.6}deg, var(--glass-bg) 0deg);">
                            <div class="progress-inner">${skill.level}%</div>
                        </div>
                        <h3>${skill.name}</h3>
                    </div>
                `);
            });

            // Populate Projects
            const projectsContainer = $('#projects-container');
            data.projects.forEach(project => {
                let tags = project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
                projectsContainer.append(`
                    <div class="project-card tilt-card" data-tilt>
                        <img src="${project.image}" alt="${project.title}" class="project-img">
                        <div class="project-info glass-card">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>
                            <div class="project-tech">${tags}</div>
                            <a href="#" class="btn btn-secondary"><i class="fa-solid fa-link"></i> View Project</a>
                        </div>
                    </div>
                `);
            });

            // Populate Internships
            const internshipsContainer = $('#internships-container');
            data.internships.forEach(intern => {
                internshipsContainer.append(`
                    <div class="internship-card glass-card tilt-card" data-tilt>
                        <i class="fa-solid ${intern.icon} internship-icon"></i>
                        <div>
                            <h3 style="color:var(--main-color); margin-bottom:5px;">${intern.role}</h3>
                            <h4 style="margin-bottom:10px;">${intern.company}</h4>
                            <p>${intern.description}</p>
                        </div>
                    </div>
                `);
            });

            // Re-initialize VanillaTilt for newly added elements
            VanillaTilt.init(document.querySelectorAll(".tilt-card"), {
                max: 15,
                speed: 400,
                glare: true,
                "max-glare": 0.2,
                gyroscope: false // Prevent annoying mobile tilting via device motion
            });

            // Initialize ScrollReveal
            ScrollReveal().reveal('.section-title', { delay: 200, origin: 'top', distance: '50px', duration: 1000 });
            ScrollReveal().reveal('.about-content', { delay: 300, origin: 'bottom', distance: '50px', duration: 1000 });
            ScrollReveal().reveal('.timeline-item:nth-child(even)', { delay: 300, origin: 'right', distance: '50px', duration: 1000 });
            ScrollReveal().reveal('.timeline-item:nth-child(odd)', { delay: 300, origin: 'left', distance: '50px', duration: 1000 });
            ScrollReveal().reveal('.skill-card', { interval: 100, delay: 200, origin: 'bottom', distance: '50px', duration: 1000 });
            ScrollReveal().reveal('.project-card', { interval: 200, delay: 200, origin: 'bottom', distance: '50px', duration: 1000 });
            ScrollReveal().reveal('.internship-card', { interval: 200, delay: 200, origin: 'bottom', distance: '50px', duration: 1000 });
            ScrollReveal().reveal('.contact-wrapper', { delay: 300, origin: 'bottom', distance: '50px', duration: 1000 });
        })
        .catch(error => {
            console.error("Failed to load portfolio data. Make sure you are running a local server to fetch data.json.", error);
        });

    // Initialize Particles.js
    particlesJS("particles-js", {
        "particles": {
            "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": ["#06b6d4", "#7c3aed", "#ffffff"] },
            "shape": { "type": "circle" },
            "opacity": { "value": 0.5, "random": true, "anim": { "enable": true, "speed": 1, "opacity_min": 0.1, "sync": false } },
            "size": { "value": 3, "random": true, "anim": { "enable": true, "speed": 2, "size_min": 0.1, "sync": false } },
            "line_linked": { "enable": true, "distance": 150, "color": "#06b6d4", "opacity": 0.4, "width": 1 },
            "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
            "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } }
        },
        "retina_detect": true
    });

    // Form Submission Details
    $('#contactForm').on('submit', function (event) {
        event.preventDefault(); 
        
        let name = $('#name').val();
        let email = $('#email').val();
        let message = $('#message').val();

        // Construct mailto link
        let subject = encodeURIComponent('Portfolio Contact Request from ' + name);
        let body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
        let mailtoLink = 'mailto:nandhinimncl@gmail.com?subject=' + subject + '&body=' + body;

        // Open default mail client
        window.open(mailtoLink, '_blank');

        // Show success message and clear form
        $('#formMessage').text('Opening your email client...').css({'color': 'var(--main-color)', 'margin-top': '15px'});
        this.reset();
        
        setTimeout(() => {
            $('#formMessage').fadeOut();
        }, 5000);
    });
});
