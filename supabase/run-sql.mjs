/**
 * Executa migration SQL via Supabase Management API
 * 
 * Execute com: node supabase/run-sql.mjs
 * 
 * Requer: SUPABASE_ACCESS_TOKEN (do dashboard pessoal)
 * O SERVICE_ROLE_KEY não funciona para Management API
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Project ref extraído da URL do Supabase
const PROJECT_REF = 'pvxowtxutzgouwcwgwdg';

// Ler SQL do arquivo
const sqlPath = join(__dirname, 'migrations', '001_lines_and_collections.sql');
const sql = readFileSync(sqlPath, 'utf-8');

console.log('='.repeat(60));
console.log('MIGRATION: Sistema de Linhas e Coleções');
console.log('='.repeat(60));
console.log('');
console.log('Este SQL precisa ser executado no Supabase SQL Editor:');
console.log('');
console.log(`URL: https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new`);
console.log('');
console.log('-'.repeat(60));
console.log('');
console.log(sql);
console.log('');
console.log('-'.repeat(60));
console.log('');
console.log('Após executar, verifique com:');
console.log('  SELECT * FROM lines;');
console.log('  SELECT * FROM product_lines;');
