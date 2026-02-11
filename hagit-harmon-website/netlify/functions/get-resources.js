// Netlify Function to fetch resources from Airtable
// Keeps API key secure on server side

exports.handler = async function(event, context) {
    const AIRTABLE_CONFIG = {
        baseId: 'app6kNCiel3qQwtk1',
        tableName: 'Resources',
        apiKey: process.env.AIRTABLE_RESOURCES_API_KEY
    };

    try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_CONFIG.baseId}/${encodeURIComponent(AIRTABLE_CONFIG.tableName)}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${AIRTABLE_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Transform Airtable records to our format
        const resources = data.records
            .filter(record => {
                // Only include if Published field exists and is true, or if Published field doesn't exist
                return record.fields.Published === undefined || record.fields.Published === true;
            })
            .map(record => ({
                id: record.id,
                link: record.fields.Link || '',
                en: {
                    title: record.fields['Title (eng)'] || '',
                    description: record.fields['Description (eng)'] || ''
                },
                he: {
                    title: record.fields['Title (heb)'] || '',
                    description: record.fields['Description (heb)'] || ''
                }
            }))
            .filter(resource => resource.link); // Only include resources with links

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(resources)
        };
    } catch (error) {
        console.error('Error fetching resources from Airtable:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ error: 'Failed to fetch resources' })
        };
    }
};
