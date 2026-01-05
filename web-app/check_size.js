
const NODE_URL = 'http://34.66.15.88:3001';

async function checkSize() {
    try {
        const start = Date.now();
        console.log('Fetching /blocks HEAD...');
        const res = await fetch(`${NODE_URL}/blocks`, { method: 'HEAD' });
        console.log('Status:', res.status);
        console.log('Content-Length:', res.headers.get('content-length'));

        console.log('Fetching /blocks GET...');
        const res2 = await fetch(`${NODE_URL}/blocks`);
        const end = Date.now();
        console.log('GET Status:', res2.status);
        const text = await res2.text();
        console.log('Body Size (chars):', text.length);
        console.log('Time (ms):', end - start);
    } catch (e) {
        console.log('Error:', e.message);
    }
}
checkSize();
