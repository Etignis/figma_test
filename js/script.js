document.addEventListener("DOMContentLoaded", function() {
	var sMainColor = '#DFC800';
	var sServColor = '#E5E5E5';
  var
    example = document.getElementById('example1'),
    hot;

  var headers = ["", "Дни", "Визиты", "Посетители", "Просмотры"];
  var myData = [
		{
			smth: true,
			data: '22/01/2019',
			visits: 34,
			users: 28,
			views: 111
		},
		{
			smth: true,
			data: '23/01/2019',
			visits: 22,
			users: 20,
			views: 89
		},
		{
			smth: true,
			data: '24/01/2019',
			visits: 60,
			users: 50,
			views: 170
		},
		{
			smth: true,
			data: '25/01/2019',
			visits: 52,
			users: 45,
			views: 120
		},
		{
			smth: true,
			data: '26/01/2019',
			visits: 42,
			users: 36,
			views: 97
		}
		
  ];
 	
	function getData(){
		return myData.concat({
			smth: false,
			data: 'Итого в среднем',
			visits: myData.reduce((nAc, nVal) => nAc+nVal.visits, 0),
			users: myData.reduce((nAc, nVal) => nAc+nVal.users, 0),
			views: myData.reduce((nAc, nVal) => nAc+nVal.views, 0)
		});
	}
	function getMinY(){
		return Math.min.apply(null, myData.filter(el=>el.data!="Итого в среднем").map(el=>el.visits))-10
	}
	function getMaxY(){
		return Math.max.apply(null, myData.filter(el=>el.data!="Итого в среднем").map(el=>el.visits))+10
	}
	
	function updateChart(nRow, sValue, sLabel){
		if(sLabel) {
			myChart.data.labels.push(sLabel);
		}
		myChart.data.datasets[0].data[nRow] = sValue;
		myChart.options.scales.yAxes[0].ticks.min = getMinY();
		myChart.options.scales.yAxes[0].ticks.max = getMaxY()
		myChart.update();
	}
	
	function addRow(){
		//
		function getCellData(){
			let aData = myData.filter(el => el.smth);
			let sDate = aData[aData.length-1].data;
			
			let aDate = sDate.split("/");
			aDate[0] ++;
			
			return aDate.join("/"); // yes, 32/01/2019
		}
		function getNumber(){
			let nMax = 180;
			let nMin = 30;
			return nMin + Math.floor(Math.random() * Math.floor(nMax-nMin));
		}
		myData.push({
			smth: true,
			data: getCellData(),
			visits: getNumber(),
			users: getNumber(),
			views: getNumber()
		});
		let aNewData = getData()
		hot.getInstance().loadData(aNewData);
    hot.render();
		updateChart(myData.length-1, myData[myData.length-1].visits, myData[myData.length-1].data);
		
	}
	
	function highligtPoint(nIndex) {
		activeElements = []
		if(nIndex>-1){
			if(myChart.tooltip._active == undefined)
				myChart.tooltip._active = []
			var activeElements = myChart.tooltip._active;
			var requestedElem = myChart.getDatasetMeta(0).data[nIndex];
			for(var i = 0; i < activeElements.length; i++) {
				 if(activeElements[i] && requestedElem && requestedElem._index == activeElements[i]._index)  
						return;
			}
			if(requestedElem) {
				activeElements = [requestedElem];
			}
		}
		myChart.tooltip._active = activeElements;
		myChart.tooltip.update(true);
		myChart.draw();
	}
	
/**/
// CHART
Chart.defaults.global.legend.display = false;
Chart.defaults.global.tooltips.backgroundColor = '#EEE';
Chart.defaults.global.tooltips.titleFontColor = '#000';
Chart.defaults.global.tooltips.bodyFontColor = '#000';
Chart.defaults.global.tooltips.displayColors = false;
Chart.defaults.global.tooltips.displayTitle = false;
// add shadow
let draw = Chart.controllers.line.prototype.draw;
Chart.controllers.line = Chart.controllers.line.extend({
    draw: function() {
        draw.apply(this, arguments);
        let ctx = this.chart.chart.ctx;
        let _stroke = ctx.stroke;
        ctx.stroke = function() {
            ctx.save();
            ctx.shadowColor = 'rgba(133, 117, 74, 0.31)';
            ctx.shadowBlur = 8;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 6;
            _stroke.apply(this, arguments)
            ctx.restore();
        }
    }
});

  var options = {
    type: 'line',

		data: {
      labels: myData.filter(el=>el.data!="Итого в среднем").map(el=>el.data),//headers,
      datasets: [{
        label: '',//rowheaders[0],
        data: myData.map(el=>el.visits),//myData[0],
        borderWidth: 4,
        backgroundColor: 'rgb(255, 236, 217)',
				lineTension: 0,
				pointRadius: 0,
				pointHoverRadius: 0,
				pointHitRadius: 9,
				fill: false,
				borderColor: sMainColor
      }]
    },
    options: {
			responsive: true,		
			tooltips: {
						callbacks: {
							 title: function() {}
						}
				 },			
			title: {
					display: false,
					text: ''
				},
			hover: {
					mode: 'nearest',
					intersect: true
				},
      scales: {
				xAxex:[{
							gridLines: {
								display: false,
								color: "black"
							}
				}
				],
        yAxes: [{
						display: false,
						scaleLabel: {
							display: false,
							labelString: 'Value'
						},
						gridLines: {
							display: false ,
							color: "rgba(0,0,0,0)"
						},
						ticks: {
							min: getMinY(),
							max: getMaxY()
						}
					}]
      }
    }
  }

  var ctx = document.querySelector('.chartJSContainer').getContext('2d');
  var myChart = new Chart(ctx, options);
	
	/// CHART END
/**/

/// strange thing renderer
function strangeThingRenderer(instance, td, row, col, prop, value, cellProperties) {
  Handsontable.renderers.TextRenderer.apply(this, arguments);
	if(value) {
		td.className = 'smthStrange';
	}
	td.innerHTML='';
}



Handsontable.renderers.registerRenderer('strangeThingRenderer', strangeThingRenderer);



class PasswordEditor extends Handsontable.editors.TextEditor {
  createElements() {
    super.createElements();
    
    this.TEXTAREA = this.hot.rootDocument.createElement('input');
    this.TEXTAREA.setAttribute('type', 'text');
    this.TEXTAREA.className = 'handsontableInput';
    this.textareaStyle = this.TEXTAREA.style;
    this.textareaStyle.width = 0;
    this.textareaStyle.height = 0;
    
    Handsontable.dom.empty(this.TEXTAREA_PARENT);
    this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
  }
}

  hot = new Handsontable(example, {
    data: getData(),
    //rowHeaders: rowheaders,
    colHeaders: headers,
    //colWidths: 88,
		stretchH: 'all',
		scrollV: 'none',
		currentColClassName: "selectedColumn",
		columns: [
			{
				data: 'smth',
				editor: false,
				width: '30em'
			},
			{
				data: 'data',
				editor: false
			},
			{
				data: 'visits',
				editor: 'numeric',
				editor: PasswordEditor
			},
			{
				data: 'users',
				editor: 'numeric',
				editor: PasswordEditor
			},
			{
				data: 'views',
				editor: 'numeric',
				editor: PasswordEditor
			},
		],
		// columnSummary: [			
			// {
				// destinationRow: 0,
				// destinationColumn: 2,
				// reversedRowCoords: true,
				// type: 'sum',
				// forceNumeric: true
			// },
			// {
				// destinationRow: 0,
				// destinationColumn: 3,
				// reversedRowCoords: true,
				// type: 'sum',
				// forceNumeric: true
			// },
			// {
				// destinationRow: 0,
				// destinationColumn: 4,
				// reversedRowCoords: true,
				// type: 'sum',
				// forceNumeric: true
			// },
		// ],
		cells: function(row, col, prop){
			var cellProperties = {};
			var data = this.instance.getData();

			if(prop == 'smth') {
				cellProperties.renderer = "strangeThingRenderer"; // uses lookup map
			} 

			if (row === myData.length) {
        cellProperties.className = 'lastRow'
      }
			return cellProperties;
		},
		//rowHeights: 50,
    licenseKey: 'non-commercial-and-evaluation',
    fillHandle: {
      autoInsertRow: false,
    },
    beforeChange: function(changes, src) {
    	if (src !== 'loadData') {
        changes.forEach((change) => {
        	var row = change[0];
          var column = change[1];
          var value = change[3] === '' ? 0 : change[3];
          
					if(column == 'visits'){
						updateChart(row, value);
					}
        });
      }
    }
  });
	
	Handsontable.hooks.add('afterSelection', function(){
		var borders = document.querySelectorAll('.handsontable .wtBorder');
		for (var i = 0; i < borders.length; i++) {
			borders[i].style.backgroundColor = sServColor;
		}
	});
	hot.addHook('afterOnCellMouseOver', function(e, coords, TD) {
     let nIndex = coords.row;
		 highligtPoint(nIndex); 
  });
	hot.addHook('afterOnCellMouseOut', function(e, coords, TD) {
		 highligtPoint(-1); 
  });
	
	 rowAdder.onclick = addRow;
});