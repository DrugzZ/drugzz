import "babel-polyfill";
import 'babel-core/register';
import "isomorphic-fetch";
const { VK } = require('vk-io');


const vk = new VK();

vk.setOptions({
	token: 'cd960ec90ee87b31491dce04c694914752f0925761a7b7c2c65bc700c180591dd66c56bf9615cf8294aed',
	apiMode: 'parallel_selected',
	webhookPath: '/webhook/secret-path'
});

const { updates } = vk;

function* quoteGenerator() {
	while (true) {
		yield fetch('http://ron-swanson-quotes.herokuapp.com/v2/quotes')
    		.then(res => res.json());
 	}
}

const generator = quoteGenerator();

// Skip outbox message and handle errors
updates.use(async (context, next) => {
	if (context.is('message') && context.isOutbox()) {
		return;
	}

	try {
		await next();
	} catch (error) {
		console.error('Error:', error);
	}
});

updates.hear('/start', async (context) => {
	await context.send(`
		My commands list
		/cat - Cat photo
	`);
});

updates.hear(/hah/i, async (context) => {
	await generator.next().value.then(function (data) {
		context.send(`${data[0]}`);
	});
});

updates.hear('/cat', async (context) => {
	await Promise.all([
		context.send('Wait for the uploads awesome 😻'),

		context.sendPhoto('http://lorempixel.com/400/200/cats/')
	]);
});

async function run() {
	if (process.env.UPDATES === 'webhook') {
		await vk.updates.startWebhook();

		console.log('Webhook server started');
	} else {
		await vk.updates.startPolling();

		console.log('Polling started');
	}
}

run().catch(console.error);