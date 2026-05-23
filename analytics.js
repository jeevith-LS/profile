const analyticsData = {
    daily: {
        stats: { complaints: 45, repairs: 18, risk: 6, health: 94, success: 98 },
        labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
        trend: {
            complaints: [12, 18, 25, 30, 32, 38, 45],
            repairs: [2, 5, 8, 10, 13, 16, 18],
            risk: [1, 2, 2, 3, 4, 5, 6]
        }
    },
    weekly: {
        stats: { complaints: 210, repairs: 96, risk: 22, health: 92, success: 96 },
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        trend: {
            complaints: [45, 80, 110, 140, 170, 195, 210],
            repairs: [18, 30, 45, 60, 72, 85, 96],
            risk: [6, 8, 12, 15, 17, 20, 22]
        }
    },
    monthly: {
        stats: { complaints: 840, repairs: 410, risk: 73, health: 89, success: 95 },
        labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4', 'Wk 5', 'Wk 6', 'Wk 7'],
        trend: {
            complaints: [210, 350, 500, 620, 700, 780, 840],
            repairs: [96, 150, 220, 290, 330, 380, 410],
            risk: [22, 30, 45, 52, 60, 68, 73]
        }
    }
};

const liveFeedData = [
    { name: "OMR Main Road", complaints: 432, dotColor: "var(--danger)" },
    { name: "Anna Salai", complaints: 398, dotColor: "var(--danger)" },
    { name: "Velachery Main Road", complaints: 365, dotColor: "var(--danger)" },
    { name: "Tambaram Junction", complaints: 344, dotColor: "var(--orange)" },
    { name: "100ft Road", complaints: 318, dotColor: "var(--orange)" },
    { name: "T. Nagar Bus Stand Road", complaints: 287, dotColor: "var(--warning)" },
    { name: "Perungudi Link Road", complaints: 264, dotColor: "var(--warning)" },
    { name: "ECR Service Lane", complaints: 241, dotColor: "var(--warning)" },
    { name: "Guindy Bridge Road", complaints: 219, dotColor: "var(--success)" },
    { name: "Medavakkam Main Road", complaints: 198, dotColor: "var(--success)" }
];

let pulseChart;

document.addEventListener('DOMContentLoaded', () => {
    initChart();
    renderLiveFeed();
    updateDashboard('daily');

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            updateDashboard(e.target.getAttribute('data-period'));
        });
    });

    // Ripple effect and click alert for export buttons
    const buttons = document.querySelectorAll('.export-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            this.focus(); // Triggers the CSS ripple animation
            const text = this.innerText.trim();
            if (text === 'Share Summary') {
                openShareModal();
            } else {
                showToast(`${text} Action Initiated Successfully!`);
            }
        });
    });

    // Share Modal Setup
    const closeShareBtn = document.getElementById('closeShareBtn');
    const shareModalOverlay = document.getElementById('shareModalOverlay');
    const copyLinkBtn = document.getElementById('copyLinkBtn');
    const shareLinkInput = document.getElementById('shareLinkInput');

    if (closeShareBtn) closeShareBtn.addEventListener('click', closeShareModal);
    if (shareModalOverlay) shareModalOverlay.addEventListener('click', closeShareModal);
    
    if (copyLinkBtn && shareLinkInput) {
        copyLinkBtn.addEventListener('click', () => {
            shareLinkInput.select();
            shareLinkInput.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(shareLinkInput.value).then(() => {
                const originalText = copyLinkBtn.innerText;
                copyLinkBtn.innerText = 'Copied!';
                setTimeout(() => {
                    copyLinkBtn.innerText = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    }
});

function initChart() {
    Chart.defaults.font.family = "'Inter', sans-serif";
    const ctx = document.getElementById('pulseChart').getContext('2d');
    
    // Creating glowing gradients
    const createGradient = (colorRGB) => {
        let gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, `rgba(${colorRGB}, 0.25)`);
        gradient.addColorStop(1, `rgba(${colorRGB}, 0.0)`);
        return gradient;
    };

    pulseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Complaints',
                    data: [],
                    borderColor: '#94a3b8', // Gray color
                    backgroundColor: createGradient('148, 163, 184'),
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#94a3b8'
                },
                {
                    label: 'Repairs',
                    data: [],
                    borderColor: '#f59e0b', // Yellow color
                    backgroundColor: createGradient('245, 158, 11'),
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#f59e0b'
                },
                {
                    label: 'High Risk Zones',
                    data: [],
                    borderColor: '#ef4444', // Red color
                    backgroundColor: createGradient('239, 68, 68'),
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#ef4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        boxWidth: 8,
                        boxHeight: 8,
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        color: '#64748b'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                    titleColor: '#0f172a',
                    bodyColor: '#64748b',
                    borderColor: '#e2e8f0',
                    borderWidth: 1,
                    padding: 12,
                    boxPadding: 6,
                    usePointStyle: true,
                    shadowColor: 'rgba(0, 0, 0, 0.05)',
                    shadowBlur: 10
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(209, 213, 221, 0.25)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(209, 213, 221, 0.25)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 11
                        }
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function animateValue(id, start, end, duration) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function updateDashboard(period) {
    const data = analyticsData[period];
    if (!data) return;
    
    // Update Stats with animated counts
    animateValue('val-complaints', 0, data.stats.complaints, 800);
    animateValue('val-repairs', 0, data.stats.repairs, 800);
    animateValue('val-risk', 0, data.stats.risk, 800);
    animateValue('val-success', 0, data.stats.success, 800);

    // Update Chart with smooth wave animation and updated labels
    pulseChart.data.labels = data.labels;
    pulseChart.data.datasets[0].data = data.trend.complaints;
    pulseChart.data.datasets[1].data = data.trend.repairs;
    pulseChart.data.datasets[2].data = data.trend.risk;
    pulseChart.update();
}

function renderLiveFeed() {
    const container = document.getElementById('live-feed-list');
    if (!container) return;
    container.innerHTML = '';

    liveFeedData.forEach((item, index) => {
        const feedItem = document.createElement('div');
        feedItem.className = 'live-feed-item';
        feedItem.style.opacity = '0';
        feedItem.style.transform = 'translateY(15px)';
        
        feedItem.innerHTML = `
            <div class="feed-dot" style="background-color: ${item.dotColor}; box-shadow: 0 0 10px ${item.dotColor}80;"></div>
            <div class="feed-content" style="flex-direction: row; align-items: center; gap: 8px;">
                <span class="feed-title">${item.name}</span>
                <span style="color: var(--text-secondary); font-size: 0.95rem;">–</span>
                <span class="feed-status" style="font-size: 0.9rem; font-weight: 500; color: var(--text-secondary);">${item.complaints} Complaints</span>
            </div>
        `;

        container.appendChild(feedItem);

        // Add divider unless it's the last item
        if (index < liveFeedData.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'feed-divider';
            container.appendChild(divider);
        }

        // Staggered entry animation
        setTimeout(() => {
            feedItem.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            feedItem.style.opacity = '1';
            feedItem.style.transform = 'translateY(0)';
        }, index * 80);
    });
}

function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = 'toast';
    }, 2500);
}

function openShareModal() {
    const overlay = document.getElementById('shareModalOverlay');
    const modal = document.getElementById('shareModal');
    if (overlay && modal) {
        overlay.classList.add('active');
        modal.classList.add('active');
    }
}

function closeShareModal() {
    const overlay = document.getElementById('shareModalOverlay');
    const modal = document.getElementById('shareModal');
    if (overlay && modal) {
        overlay.classList.remove('active');
        modal.classList.remove('active');
    }
}
