
const NODE_URL = 'http://34.66.15.88:3001';

async function testNode() {
    console.log(`Testing connection to ${NODE_URL}...`);
    try {
        // Test 1: Fetch all blocks (HEAD check)
        console.log('Test 1: fetching /blocks (HEAD)...');
        const res = await fetch(`${NODE_URL}/blocks`, { method: 'HEAD' });
        console.log(`Status: ${res.status}`);

        // Test 2: Fetch /info or /status
        console.log('Test 2: fetching /info...');
        try {
            const resInfo = await fetch(`${NODE_URL}/info`);
            if (resInfo.ok) {
                const data = await resInfo.json();
                console.log('Info:', data);
            } else {
                console.log('/info status:', resInfo.status);
            }
        } catch (e) {
            console.log('/info not supported or error', e.message);
        }

        // Test 3: Fetch paginated blocks custom endpoint if exists
        console.log('Test 3: fetching /blocks/0/1 ...');
        try {
            const resPage = await fetch(`${NODE_URL}/blocks/0/1`);
            if (resPage.ok) {
                const data = await resPage.json();
                console.log('Pagination /blocks/:from/:to supported:', Array.isArray(data));
            } else {
                console.log('/blocks/0/1 status:', resPage.status);
            }
        } catch (e) {
            console.log('/blocks/:from/:to not supported');
        }

        // Test 4: Fetch block by index
        console.log('Test 4: fetching /block/0 ...');
        try {
            const resBlock = await fetch(`${NODE_URL}/block/0`);
            if (resBlock.ok) {
                const data = await resBlock.json();
                console.log('Block 0 fetched:', data.hash);
            } else {
                console.log('/block/0 status:', resBlock.status);
            }
        } catch (e) {
            console.log('/block/:index not supported');
        }

    } catch (err) {
        console.error('Connection failed:', err.message);
    }
}

testNode();
