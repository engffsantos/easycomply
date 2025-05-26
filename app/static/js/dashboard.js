/* app/static/js/dashboard.js */

(function () {
  "use strict";

  // Exemplo de inicialização de gráficos com Chart.js
  // Certifique-se de que Chart.js está incluído no seu template ou via import se estiver usando um bundler.
  // Este script seria referenciado no template dashboard.html

  // Feather Icons (já incluído no dashboard.html via CDN, mas pode ser gerenciado aqui)
  // if (typeof feather !== "undefined") {
  //   feather.replace();
  // }

  // Exemplo de dados para um gráfico
  var ctx = document.getElementById("myChart");
  if (ctx) {
    var myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Domingo",
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sábado",
        ],
        datasets: [
          {
            data: [
              15339,
              21345,
              18483,
              24003,
              23489,
              24092,
              12034,
            ],
            lineTension: 0,
            backgroundColor: "transparent",
            borderColor: "#007bff",
            borderWidth: 4,
            pointBackgroundColor: "#007bff",
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
              },
            },
          ],
        },
        legend: {
          display: false,
        },
      },
    });
  }
})();

