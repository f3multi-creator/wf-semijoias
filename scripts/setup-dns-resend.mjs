// Script para configurar DNS do Resend via API Vercel
const VERCEL_TOKEN = 'zKyTMIOu5DGrnY8e9QGNpshk';
const TEAM_ID = 'team_NJBqKzkV8PRLZDnMwnvh0Yph';
const DOMAIN = 'wfsemijoias.com.br';

const BASE_URL = `https://api.vercel.com/v4/domains/${DOMAIN}/records`;

const headers = {
    'Authorization': `Bearer ${VERCEL_TOKEN}`,
    'Content-Type': 'application/json'
};

// Registros DNS que precisamos criar para o Resend
const dnsRecords = [
    {
        name: 'send',
        type: 'MX',
        value: 'feedback-smtp.sa-east-1.amazonses.com',
        mxPriority: 10,
        ttl: 60,
        comment: 'Resend - MX record for email sending'
    },
    {
        name: 'send',
        type: 'TXT',
        value: 'v=spf1 include:amazonses.com ~all',
        ttl: 60,
        comment: 'Resend - SPF record'
    },
    {
        name: 'resend._domainkey',
        type: 'TXT',
        value: 'p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDT1KDXoNm5LOww/x69GPm/R3U24LtxDMp1Q2a9nhTmtZgJ5hSRzLECK/CUibh47AbK+N+n8jGhQRAxNCO59cKhmQ3RFVT/2e8cJD8GlXT2oIgaundoiorPWDjNcs5C3N3YcftwDwyMF3bz/q0fkhF79Ni4lHewE2jVI4/EnJOONQIDAQAB',
        ttl: 60,
        comment: 'Resend - DKIM record'
    }
];

async function listExistingRecords() {
    console.log('📋 Listando registros DNS existentes...\n');

    const response = await fetch(`${BASE_URL}?teamId=${TEAM_ID}`, {
        method: 'GET',
        headers
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Erro ao listar registros:', error);
        return [];
    }

    const data = await response.json();
    console.log('Registros existentes:');
    data.records.forEach(r => {
        console.log(`  - ${r.type.padEnd(5)} ${r.name.padEnd(25)} ${r.value?.substring(0, 50) || r.mxHostname || ''}...`);
    });
    console.log('');

    return data.records;
}

async function createRecord(record) {
    console.log(`➕ Criando registro ${record.type} para "${record.name}"...`);

    const body = {
        name: record.name,
        type: record.type,
        value: record.value,
        ttl: record.ttl || 60,
        comment: record.comment
    };

    if (record.type === 'MX') {
        body.mxPriority = record.mxPriority;
    }

    const response = await fetch(`${BASE_URL}?teamId=${TEAM_ID}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    });

    const result = await response.json();

    if (!response.ok) {
        console.log(`   ❌ Erro: ${result.error?.message || JSON.stringify(result)}`);
        return false;
    }

    console.log(`   ✅ Criado! UID: ${result.uid}`);
    return true;
}

async function main() {
    console.log('🚀 Configurando DNS para Resend - WF Semijoias\n');
    console.log('='.repeat(50) + '\n');

    // Listar registros existentes
    const existingRecords = await listExistingRecords();

    // Verificar quais registros já existem
    for (const record of dnsRecords) {
        const exists = existingRecords.some(r =>
            r.type === record.type &&
            r.name === record.name
        );

        if (exists) {
            console.log(`⏭️  Pulando ${record.type} ${record.name} (já existe)`);
        } else {
            await createRecord(record);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ Configuração concluída!');
    console.log('📌 Agora volte ao Resend e clique em "Verify DNS Records"');
}

main().catch(console.error);
