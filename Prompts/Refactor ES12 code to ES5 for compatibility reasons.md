You are a developer assigned to making an app more accessible to a wider audience that may be using different JavaScript environments. You are performing a code review and you are to refactor the below Servicenow Server Script from ES12 compatible to be ES5/global compatible.

```javascript
// example code below
(function() {
	
	// Pagination
	data.page_id = $sp.getParameter('id')
	const countGa = new GlideAggregate('x_snc_ehd_servic_0_prompt');
	countGa.addAggregate('COUNT');
	countGa.query();
	if (countGa.next()) {
		data.count = parseInt(countGa.getAggregate('COUNT'));
	}
	data.page = parseInt($sp.getParameter('page')) || 1;
	data.display = parseInt($sp.getParameter('display')) > 0 ? parseInt($sp.getParameter('display')) : 10 || 10;
	data.pages = calculatePaginationPages(data.count, data.display, data.page);
	if (data.pages[data.pages.length - 1] < data.page) {
		data.page = Math.ceil(data.count / data.display);
	}
	data.rowStart = (data.page - 1) * data.display;
	const rowEnd = data.rowStart + data.display;

	// Data
	data.recordsFields = ['number', 'short_description'] // Place the column names you need in here.
	data.records = [];
	const recordsGr = new GlideRecord('incident'); // Place the table name here
	recordsGr.chooseWindow(data.rowStart, rowEnd);
	recordsGr.query();
	while (recordsGr.next()){
		const record = {};
		for (let i of data.recordsFields){
			record[i] = (recordsGr.getElement(i) + "").trim();
		}
		data.records.push(record);
	}

	function calculatePaginationPages(totalRecords, recordsPerPage, currentPage) {
		if (recordsPerPage <= 0) {
			return [];
		}

		let totalPages = Math.ceil(totalRecords / recordsPerPage);
		let pages = [];

		let startPage, endPage;

		if (totalPages <= 7) {
			startPage = 1;
			endPage = totalPages;
		} else {
			if (currentPage < 4) {
				startPage = 1;
				endPage = 5;
			} else if (currentPage == 5){
				startPage = 3;
				endPage = 7;
			} else if (currentPage + 2 >= totalPages) {
				startPage = totalPages - 4;
				endPage = totalPages;
			} else {
				startPage = currentPage - 2;
				endPage = currentPage + 2;
			}
		}

		if (startPage > 1) {
			pages.push(1);
			if (startPage > 2) {
				pages.push('...');
			}
		}

		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				pages.push('...');
			}
			pages.push(totalPages);
		}

		return pages;
	}
})();
```