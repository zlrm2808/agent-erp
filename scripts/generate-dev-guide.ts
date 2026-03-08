
import fs from 'fs';
import path from 'path';

const SRC_DIR = path.join(process.cwd(), 'src', 'modules');
const OUTPUT_FILE = path.join(process.cwd(), 'GUIA_DESARROLLADORES.md');

interface FunctionDoc {
    name: string;
    description: string;
    line: number;
}

function getFunctionsInFile(filePath: string): FunctionDoc[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    const functions: FunctionDoc[] = [];

    // Improved regex to capture async functions and normal exported functions
    const regex = /(?:\/\*\*([\s\S]*?)\*\/)?\s*(?:export\s+(?:async\s+)?)?function\s+([a-zA-Z0-9_]+)\s*\(|([a-zA-Z0-9_]+):\s*(?:async\s+)?\(/g;

    let match;
    while ((match = regex.exec(content)) !== null) {
        const jsDoc = match[1];
        const funcName = match[2] || match[3];

        if (!funcName || ['catch', 'then', 'if', 'while', 'for', 'switch'].includes(funcName)) continue;

        let description = "Sin descripción detallada.";
        if (jsDoc) {
            description = jsDoc
                .split('\n')
                .map(line => line.replace(/^\s*\*\s?/, '').trim())
                .filter(line => line && !line.startsWith('@'))
                .join(' ');
        } else {
            // Fallback: look at the line before
            const linesBefore = content.slice(0, match.index).split('\n');
            const lastLine = linesBefore[linesBefore.length - 2]?.trim();
            if (lastLine && (lastLine.startsWith('//') || lastLine.startsWith('*'))) {
                description = lastLine.replace(/^\/\/\s*/, '').replace(/^\*\s*/, '').trim();
            }
        }

        const lineNumber = content.slice(0, match.index).split('\n').length;
        functions.push({ name: funcName, description: description || "Sin descripción.", line: lineNumber });
    }
    return functions;
}

function generateGuide() {
    let markdown = `# 📘 Guía para Desarrolladores - AgentERP (IA-Powered)\n\n`;
    markdown += `> **Nota:** Este documento se actualiza automáticamente. Proporciona un índice detallado de las funciones del sistema y sugerencias de optimización de la IA.\n\n`;

    markdown += `## 📋 Índice de Módulos\n`;
    const modules = fs.readdirSync(SRC_DIR).filter(f => fs.statSync(path.join(SRC_DIR, f)).isDirectory());
    modules.forEach(m => markdown += `- [Módulo ${m.toUpperCase()}](#-módulo-${m.toLowerCase()})\n`);
    markdown += `- [Capa de Datos y DB](#-capa-de-datos-y-base-de-datos)\n`;
    markdown += `- [Análisis de IA](#-análisis-de-ia-redundancias-y-optimizaciones)\n\n`;

    modules.forEach(module => {
        markdown += `---\n\n## 📦 Módulo: ${module.toUpperCase()}\n`;
        const modulePath = path.join(SRC_DIR, module);

        const processDir = (dir: string, depth = 0) => {
            const items = fs.readdirSync(dir);
            items.forEach(item => {
                const fullPath = path.join(dir, item);
                if (fs.statSync(fullPath).isDirectory()) {
                    processDir(fullPath, depth + 1);
                } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
                    const functions = getFunctionsInFile(fullPath);
                    if (functions.length > 0) {
                        const relPath = path.relative(process.cwd(), fullPath);
                        markdown += `### 📄 ${item} (\`${relPath}\`)\n`;
                        functions.forEach(fn => {
                            markdown += `- **[${fn.name}](${relPath}#L${fn.line})**: ${fn.description}\n`;
                        });
                        markdown += `\n`;
                    }
                }
            });
        };

        processDir(modulePath);
    });

    markdown += `---\n\n## 🗄️ Capa de Datos y Base de Datos\n\n`;
    markdown += `### Esquemas Prisma\n`;
    markdown += `- **[Main Schema](prisma/schema.prisma)**: Esquema central de usuarios y empresas.\n`;
    markdown += `- **[Tenant Schema](prisma/tenant.prisma)**: Esquema dinámico para cada empresa (Inventario, Ventas, etc.).\n\n`;

    markdown += `---\n\n## 🧠 Análisis de IA (Redundancias y Optimizaciones)\n\n`;
    markdown += `### ✅ Mejoras realizadas recientemente:\n`;
    markdown += `- **Cumplimiento Fiscal SENIAT**: Implementación de la Providencia SNAT/2024/000102. Generación automática de Números de Factura y Control, integración con Imprenta Digital simulada y snapshots de datos de clientes.\n`;
    markdown += `- **Unificación de Sucursales**: El método \`getBranches\` se centralizó en \`OrganizationRepository\`.\n`;
    markdown += `- **Caché de Conexiones**: Se implementó un pool de clientes Prisma con estrategia LRU (Limitado a 50).\n\n`;

    markdown += `### 🚀 Optimizaciones sugeridas:\n`;
    markdown += `1. **Digital Signature**: Integrar una firma XML real para los documentos generados si se requiere interoperabilidad directa con el portal de SENIAT.\n`;
    markdown += `2. **Typed Actions**: Migrar los Server Actions para usar \`next-safe-action\`.\n`;
    markdown += `3. **Batch Sync**: Implementar \`createMany\` para la sincronización offline.\n`;


    fs.writeFileSync(OUTPUT_FILE, markdown);
    console.log(`✅ Guía para Desarrolladores actualizada: ${OUTPUT_FILE}`);
}

try {
    generateGuide();
} catch (e: any) {
    console.error(`❌ Error al generar la guía: ${e.message}`);
}
