const fs = require('fs');
const path = require('path');

async function debugUpload() {
    // Create a boundary for multipart form data
    const boundary = '--------------------------' + Date.now().toString(16);

    const filePath = path.join(__dirname, 'test_media.pdf');
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, 'dummy content');
    const fileContent = fs.readFileSync(filePath);

    // Construct the multipart body manually since Node's FormData can be tricky with files without libraries
    let body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="title"\r\n\r\nDebug Lesson\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\nDebug Description\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="level"\r\n\r\nBasic\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="mediaType"\r\n\r\nvideo\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="displayOrder"\r\n\r\n1\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="media"; filename="test_media.pdf"\r\nContent-Type: application/pdf\r\n\r\n`),
        fileContent,
        Buffer.from(`\r\n--${boundary}--`)
    ]);

    try {
        const response = await fetch('http://localhost:5000/api/lessons/upload', {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: body
        });

        const data = await response.json();
        console.log('--- START DEBUG RESPONSE ---');
        console.log('Status:', response.status);
        console.log(JSON.stringify(data, null, 2));
        console.log('--- END DEBUG RESPONSE ---');
    } catch (err) {
        console.error('Debug Script Error:', err);
    }
}

debugUpload();
