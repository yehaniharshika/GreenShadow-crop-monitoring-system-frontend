document.addEventListener("DOMContentLoaded", function () {
    let barChartInstance, pieChartInstance;

    // Bar chart for Crop Growth
    const barChartCanvas = document.getElementById('bar-chart');
    if (barChartCanvas && barChartCanvas.tagName.toLowerCase() === 'canvas') {
        barChartInstance = new Chart(barChartCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], // Months
                datasets: [{
                    label: 'Growth Rate',
                    data: [3, 2, 5, 1, 6, 4, 7], // Growth rate data
                    borderColor: '#218c74',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'black', // Font color
                            font: {
                                family: 'Ubuntu', // Font family
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        titleFont: {
                            family: 'Ubuntu',
                            size: 12
                        },
                        bodyFont: {
                            family: 'Ubuntu',
                            size: 12
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Months',
                            color: 'black',
                            font: {
                                family: 'Ubuntu',
                                size: 14
                            }
                        },
                        ticks: {
                            color: 'black',
                            font: {
                                family: 'Ubuntu',
                                size: 12
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Growth Rate',
                            color: 'black',
                            font: {
                                family: 'Ubuntu',
                                size: 14
                            }
                        },
                        ticks: {
                            color: 'black',
                            font: {
                                family: 'Ubuntu',
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    // Pie chart for Yield Analytics
    const pieChartCanvas = document.getElementById('pie-chart');
    if (pieChartCanvas && pieChartCanvas.tagName.toLowerCase() === 'canvas') {
        pieChartInstance = new Chart(pieChartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Crop A', 'Crop B', 'Crop C', 'Crop D'], // Crops
                datasets: [{
                    label: 'Yield (kg)',
                    data: [120, 150, 180, 100], // Yield data
                    backgroundColor: ['#6F1E51', '#58B19F', '#ab47bc', '#29b6f6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            color: 'black', // Font color
                            font: {
                                family: 'Ubuntu', // Font family
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        titleFont: {
                            family: 'Ubuntu',
                            size: 12
                        },
                        bodyFont: {
                            family: 'Ubuntu',
                            size: 12
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Crops',
                            color: 'black',
                            font: {
                                family: 'Ubuntu',
                                size: 14
                            }
                        },
                        ticks: {
                            color: 'black',
                            font: {
                                family: 'Ubuntu',
                                size: 12
                            }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Yield (kg)',
                            color: 'black',
                            font: {
                                family: 'Ubuntu',
                                size: 14
                            }
                        },
                        ticks: {
                            color: 'black',
                            font: {
                                family: 'Ubuntu',
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    }

    // Handle window resize to refresh charts
    window.addEventListener('resize', function () {
        if (barChartInstance) barChartInstance.resize();
        if (pieChartInstance) pieChartInstance.resize();
    });
});
