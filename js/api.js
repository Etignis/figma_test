document.addEventListener("DOMContentLoaded", function() {
	var sServColor = '#E5E5E5';
	// custom Excel downloader
	/*/
	let myExcelXML = (function() {
    let Workbook, WorkbookStart = '<?xml version="1.0"?><ss:Workbook  xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40">';
    const WorkbookEnd = '</ss:Workbook>';
    let fs, SheetName = 'SHEET 1',
        styleID = 1, columnWidth = 80,
        fileName = "ExcellList", uri, link;

    class myExcelXML {
        constructor(o) {
            let respArray = JSON.parse(o);
            let finalDataArray = [];

            for (let i = 0; i < respArray.length; i++) {
                finalDataArray.push(flatten(respArray[i]));
            }

            let s = JSON.stringify(finalDataArray);
            fs = s.replace(/&/gi, '&amp;');
        }

        downLoad(sName) {
            const Worksheet = myXMLWorkSheet(SheetName, fs);

            WorkbookStart += myXMLStyles(styleID);

            Workbook = WorkbookStart + Worksheet + WorkbookEnd;

            uri = 'data:text/xls;charset=utf-8,' + encodeURIComponent(Workbook);
            link = document.createElement("a");
            link.href = uri;
            link.style = "visibility:hidden";
            link.download = (sName||fileName) + ".xls";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        get fileName() {
            return fileName;
        }

        set fileName(n) {
            fileName = n;
        }

        get SheetName() {
            return SheetName;
        }

        set SheetName(n) {
            SheetName = n;
        }

        get styleID() {
            return styleID;
        }

        set styleID(n) {
            styleID = n;
        }
    }

    const myXMLStyles = function(id) {
        let Styles = '<ss:Styles><ss:Style ss:ID="' + id + '"><ss:Font ss:Bold="1"/></ss:Style></ss:Styles>';

        return Styles;
    }

    const myXMLWorkSheet = function(name, o) {
        const Table = myXMLTable(o);
        let WorksheetStart = '<ss:Worksheet ss:Name="' + name + '">';
        const WorksheetEnd = '</ss:Worksheet>';

        return WorksheetStart + Table + WorksheetEnd;
    }

    const myXMLTable = function(o) {
        let TableStart = '<ss:Table>';
        const TableEnd = '</ss:Table>';

        const tableData = JSON.parse(o);

        if (tableData.length > 0) {
            const columnHeader = Object.keys(tableData[0]);
            let rowData;
            for (let i = 0; i < columnHeader.length; i++) {
                TableStart += myXMLColumn(columnWidth);

            }
            for (let j = 0; j < tableData.length; j++) {
                rowData += myXMLRow(tableData[j], columnHeader);
            }
            TableStart += myXMLHead(1, columnHeader);
            TableStart += rowData;
        }

        return TableStart + TableEnd;
    }

    const myXMLColumn = function(w) {
        return '<ss:Column ss:AutoFitWidth="0" ss:Width="' + w + '"/>';
    }


    const myXMLHead = function(id, h) {
        let HeadStart = '<ss:Row ss:StyleID="' + id + '">';
        const HeadEnd = '</ss:Row>';

        for (let i = 0; i < h.length; i++) {
            const Cell = myXMLCell(h[i].toUpperCase());
            HeadStart += Cell;
        }

        return HeadStart + HeadEnd;
    }

    const myXMLRow = function(r, h) {
        let RowStart = '<ss:Row>';
        const RowEnd = '</ss:Row>';
        for (let i = 0; i < h.length; i++) {
            const Cell = myXMLCell(r[h[i]]);
            RowStart += Cell;
        }

        return RowStart + RowEnd;
    }

    const myXMLCell = function(n) {
        let CellStart = '<ss:Cell>';
        const CellEnd = '</ss:Cell>';

        const Data = myXMLData(n);
        CellStart += Data;

        return CellStart + CellEnd;
    }

    const myXMLData = function(d) {
        let DataStart = '<ss:Data ss:Type="String">';
        const DataEnd = '</ss:Data>';

        return DataStart + d + DataEnd;
    }

    const flatten = function(obj) {
        var obj1 = JSON.parse(JSON.stringify(obj));
        const obj2 = JSON.parse(JSON.stringify(obj));
        if (typeof obj === 'object') {
            for (var k1 in obj2) {
                if (obj2.hasOwnProperty(k1)) {
                    if (typeof obj2[k1] === 'object' && obj2[k1] !== null) {
                        delete obj1[k1]
                        for (var k2 in obj2[k1]) {
                            if (obj2[k1].hasOwnProperty(k2)) {
                                obj1[k1 + '-' + k2] = obj2[k1][k2];
                            }
                        }
                    }
                }
            }
            var hasObject = false;
            for (var key in obj1) {
                if (obj1.hasOwnProperty(key)) {
                    if (typeof obj1[key] === 'object' && obj1[key] !== null) {
                        hasObject = true;
                    }
                }
            }
            if (hasObject) {
                return flatten(obj1);
            } else {
                return obj1;
            }
        } else {
            return obj1;
        }
    }

    return myExcelXML;
})();
	/**/
	// Переопределяем редактор текста (в основном для выравнивания содержимого)
	class CustomEditor extends Handsontable.editors.TextEditor {
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
	
		// заменяем цвета выделений...
	Handsontable.hooks.add('afterSelection', function(){
		var borders = document.querySelectorAll('.handsontable .wtBorder');
		for (var i = 0; i < borders.length; i++) {
			borders[i].style.backgroundColor = sServColor;
		}
	});
	
	const app = new Vue({
		el: "#app",
		components: {
			HotTable
		},
		data: function() {
			return {
				root: "testHot",
				sServiceUrl: "https://jsonplaceholder.typicode.com/users",
				showState: false,
				oTableColumnsHeaders: {
					name: "Имя",
					username: "Логин",
					email: "Email",
					address: {
						title: "Адрес",
						nodes: {
							street: "Улица",
							suite: "Блок",
							city: "Город",
							zipcode: "Индекс",
							geo: {
								title: "Координаты",
								nodes: {
									lat: "Широта",
									lng: "Долгота"
								}
							}
						}
					},
					phone: "Телефон",
					website: "Сайт",
					company: {
						title: "Компания",
						nodes: {
							name: "Название",
							catchPhrase: "Слоган",
							bs: "Описание"
						}
					}
				},
				hotSettings: {
					colHeaders: [
						"Имя",
						"Логин",
						"Email",
						"Телефон",
						"Сайт",
						"Компания"
					],
					columns: [
						{
							editor: CustomEditor,
							data: 'name'
						},
						{
							editor: CustomEditor,
							data: 'username'
						},
						{
							editor: CustomEditor,
							data: 'email'
						},
						{
							editor: CustomEditor,
							data: 'phone'
						},
						{
							editor: CustomEditor,
							data: 'website'
						},
						{
							editor: CustomEditor,
							data: 'company.name'
						},
					],
					data: [
						{
							name: "Имя",
							username: "Логин",
							email: "Email",
							phone: "Телефон",
							website: "Сайт",
							'company.name': "Компания"
						}
					],
					
					stretchH: 'all',
					licenseKey: 'non-commercial-and-evaluation',
					maxRows: 6,
					manualColumnResize: true,
					manualRowResize: true
				},
			};
		},
		created: function(){
			this.getData();
		},
		
		methods: {
			_sendRequest: async function({sUrl, oParams, successCallback, errorCallback, bNoCors}) {
				try{
					let oResponse = await fetch(sUrl, oParams);
					if (oResponse.ok || bNoCors && oResponse.status ==0) { 	
						if(successCallback) {
							successCallback(oResponse);
						}	
					} else {
						alert(`Ошибка HTTP: ${oResponse.status}`);
						if(errorCallback) {
							errorCallback();
						}	
					}
				} catch (err) {
					alert("Ошибка при попытке отправить запрос.\r\nПодробности в консоли.");
					console.dir(err);
					if(errorCallback) {
						errorCallback();
					}	
				}
				
			},
			getData: async function(){
				const fSuccsess = async function(oResp){
					if (oResp) {
						const json = await oResp.json();
						let oTable = this.$refs.hot.table;
						oTable.loadData(json);
						oTable.render();
						//this.hotSettings.data = json;
						
						this.showState = true;
						setTimeout(function(){this.showState = false;}.bind(this), 2000);
					}
				}.bind(this);
				
				this._sendRequest({
					sUrl: this.sServiceUrl, 
					successCallback: fSuccsess});				
			},
			
			sendData: async function(){
				let oParams = {};
				oParams.method = 'POST';
				oParams.mode = 'no-cors';
				/*/
				// multipart 
				
				var FD  = new FormData();
				for(key in obj) {
					FD.append(name, obj[key]);
				}
				oParams.body = FD;
				
				/**/
				
				oParams.body = JSON.stringify(this.hotSettings.data);
				oParams.headers = {
					'Content-Type': 'application/json'
				};
					
				const fSuccsess = async function(oResp){
					console.log('Успех:');
					console.dir(oResp);
					alert("Отправлено");
				}.bind(this);
				
				this._sendRequest({
					sUrl: this.sServiceUrl, 
					oParams: oParams, 
					successCallback: fSuccsess, 
					bNoCors: true
				});
			},
			
			_prepareExcelData: function(){
				/*
				[
					[{},{},],
					[{},{},],
				],
				*/
				let aData = [this.hotSettings.colHeaders.map(cell=>({value: cell, type: 'string'}))]
				.concat(
					this.$refs.hot.table.getData().map(row=>row.map(cell=>({value: cell, type: 'string'})))
				);
				return aData;
			},
			saveXls: function(){
				/*/
				var myTestXML = new myExcelXML(JSON.stringify(this.$refs.hot.table.getData()));
				myTestXML.downLoad("Users");
				/**/
				zipcelx({
					filename: 'Users',
					sheet: {
						data: this._prepareExcelData()
					}
				});
			}
		}
	})
});