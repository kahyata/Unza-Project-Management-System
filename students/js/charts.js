/**
 * charts.js - DEBUG VERSION
 * Chart.js implementation for UNZA Project Management System Dashboard
 * Creates doughnut charts for Project Progress and Tasks
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - attempting to initialize charts');
    initializeCharts();
});

// Store chart instances for cleanup
let projectChart = null;
let taskChart = null;

// Also initialize charts when dashboard page is dynamically loaded
document.addEventListener('click', function(e) {
    const target = e.target;
    if (target.classList.contains('menu-item') && target.getAttribute('data-page') === 'dashboard.html') {
        console.log('Dashboard menu item clicked - scheduling chart initialization');
        // Add a small delay to ensure the content is loaded
        setTimeout(initializeCharts, 200);
    }
});

// Destroy existing charts before creating new ones
function destroyExistingCharts() {
    console.log('Destroying existing charts...');
    if (projectChart) {
        projectChart.destroy();
        projectChart = null;
        console.log('Project chart destroyed');
    }
    if (taskChart) {
        taskChart.destroy();
        taskChart = null;
        console.log('Task chart destroyed');
    }
}

function initializeCharts() {
    console.log('=== CHART INITIALIZATION DEBUG ===');
    
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded! Make sure the CDN link is working.');
        return;
    } else {
        console.log('Chart.js is loaded successfully');
    }
    
    // Destroy existing charts first
    destroyExistingCharts();
    
    // Check if canvas elements exist before initializing
    const overallProgressCanvas = document.getElementById('overall-progress');
    const taskProgressCanvas = document.getElementById('task-progress');
    
    console.log('Canvas elements check:', {
        overallProgress: !!overallProgressCanvas,
        taskProgress: !!taskProgressCanvas,
        overallProgressElement: overallProgressCanvas,
        taskProgressElement: taskProgressCanvas
    });
    
    // Additional debugging - check if elements have proper dimensions
    if (overallProgressCanvas) {
        const rect = overallProgressCanvas.getBoundingClientRect();
        console.log('Overall progress canvas dimensions:', {
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0
        });
    }
    
    if (taskProgressCanvas) {
        const rect = taskProgressCanvas.getBoundingClientRect();
        console.log('Task progress canvas dimensions:', {
            width: rect.width,
            height: rect.height,
            visible: rect.width > 0 && rect.height > 0
        });
    }
    
    if (overallProgressCanvas) {
        console.log('Creating project progress chart...');
        try {
            createProjectProgressChart();
            console.log('Project progress chart created successfully');
        } catch (error) {
            console.error('Error creating project progress chart:', error);
        }
    } else {
        console.error('overall-progress canvas element not found in DOM');
    }
    
    if (taskProgressCanvas) {
        console.log('Creating task progress chart...');
        try {
            createTaskProgressChart();
            console.log('Task progress chart created successfully');
        } catch (error) {
            console.error('Error creating task progress chart:', error);
        }
    } else {
        console.error('task-progress canvas element not found in DOM');
    }
    
    console.log('=== CHART INITIALIZATION COMPLETE ===');
}

// Project Progress Doughnut Chart
function createProjectProgressChart() {
    const ctx = document.getElementById('overall-progress');
    if (!ctx) {
        console.error('Canvas element overall-progress not found');
        return;
    }

    console.log('Creating project chart with context:', ctx);

    // Sample data - replace with actual project data
    const completedProjects = 7;
    const incompleteProjects = 3;
    const totalProjects = completedProjects + incompleteProjects;
    const completionPercentage = Math.round((completedProjects / totalProjects) * 100);

    try {
        projectChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Incomplete'],
                datasets: [{
                    data: [completedProjects, incompleteProjects],
                    backgroundColor: [
                        '#4CAF50', // Green for completed
                        '#FF5722'  // Red for incomplete
                    ],
                    borderColor: [
                        '#45a049',
                        '#e64a19'
                    ],
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const percentage = Math.round((value / totalProjects) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%',
                elements: {
                    arc: {
                        borderRadius: 4
                    }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: function(chart) {
                    const ctx = chart.ctx;
                    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                    
                    ctx.save();
                    ctx.font = 'bold 20px Arial';
                    ctx.fillStyle = '#333';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${completionPercentage}%`, centerX, centerY - 5);
                    
                    ctx.font = '12px Arial';
                    ctx.fillStyle = '#666';
                    ctx.fillText('Complete', centerX, centerY + 15);
                    ctx.restore();
                }
            }]
        });
        console.log('Project chart instance created:', projectChart);
    } catch (error) {
        console.error('Error creating project chart:', error);
    }
}

// Task Progress Doughnut Chart
function createTaskProgressChart() {
    const ctx = document.getElementById('task-progress');
    if (!ctx) {
        console.error('Canvas element task-progress not found');
        return;
    }

    console.log('Creating task chart with context:', ctx);

    // Sample data - replace with actual task data
    const completedTasks = 24;
    const incompleteTasks = 8;
    const totalTasks = completedTasks + incompleteTasks;
    const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

    try {
        taskChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Incomplete'],
                datasets: [{
                    data: [completedTasks, incompleteTasks],
                    backgroundColor: [
                        '#2196F3', // Blue for completed
                        '#FFC107'  // Yellow for incomplete
                    ],
                    borderColor: [
                        '#1976d2',
                        '#ffb300'
                    ],
                    borderWidth: 2,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true,
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const percentage = Math.round((value / totalTasks) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                },
                cutout: '60%',
                elements: {
                    arc: {
                        borderRadius: 4
                    }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: function(chart) {
                    const ctx = chart.ctx;
                    const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
                    const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
                    
                    ctx.save();
                    ctx.font = 'bold 20px Arial';
                    ctx.fillStyle = '#333';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${completionPercentage}%`, centerX, centerY - 5);
                    
                    ctx.font = '12px Arial';
                    ctx.fillStyle = '#666';
                    ctx.fillText('Complete', centerX, centerY + 15);
                    ctx.restore();
                }
            }]
        });
        console.log('Task chart instance created:', taskChart);
    } catch (error) {
        console.error('Error creating task chart:', error);
    }
}

// Function to update chart data (for future use when you have dynamic data)
function updateProjectProgress(completed, incomplete) {
    const chart = Chart.getChart('overall-progress');
    if (chart) {
        chart.data.datasets[0].data = [completed, incomplete];
        chart.update();
    }
}

function updateTaskProgress(completed, incomplete) {
    const chart = Chart.getChart('task-progress');
    if (chart) {
        chart.data.datasets[0].data = [completed, incomplete];
        chart.update();
    }
}

// Export functions for potential use in other modules
window.chartUtils = {
    updateProjectProgress,
    updateTaskProgress,
    initializeCharts
};