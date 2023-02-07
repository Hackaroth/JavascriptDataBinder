moment.locale('it');

DataBinder = new DataBinder(document.body);

DataBinder.addFormatter('date', (value) => {
	let result = "";

	if (value !== null) {

	    let dt = luxon.DateTime.fromISO(value, { locale: 'it' });
	    result = dt.toFormat("dd/MM/yyyy HH:mm");
		//result = moment(value).format("L LT"); -- Using moment
	}
	
	return result;
});

DataBinder.getElement('sel').setDataSource({
	defs: {key: 'id', text: 'nome'},
	data: [{id:1, nome:'primo'}, {id:2, nome:'secondo'}, {id:3, nome:'terzo'}]
});

data = { 
	Utente:  {
		NomeCompleto: 'Mario Rossi',
		DataNascita: '2022-11-18T00:00:00.000Z',
		OraNascita: '12:40'
	}, 
	Quantita: 12,
	Attivo: 1, 
	Area: 'Area 1', 
	Note: 'Note', 
	Selezione: 2
};

observerd_data = DataBinder.bind(data);

DataBinder.onChange = function(sender) {
	console.log(`on change globale per elemento ${sender.id}`);
}

DataBinder.getElement('sel').on('change', (sender) => {
	console.log(`on change singolo elemento ${sender.id}`);
});

