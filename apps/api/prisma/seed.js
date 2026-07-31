"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Prisma seed script
 * Usage: pnpm --filter @portfolio/api db:seed
 * Requires: DATABASE_URL in .env, and an admin user in .env
 */
const client_1 = require("@prisma/client");
const argon2 = __importStar(require("argon2"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.warn('🌱 Seeding database...');
    // ---- 1. Admin user ----
    const email = process.env['ADMIN_EMAIL'] ?? 'admin@example.com';
    const password = process.env['ADMIN_PASSWORD'] ?? 'SuperSecret123!';
    const passwordHash = await argon2.hash(password);
    const admin = await prisma.user.upsert({
        where: { email },
        update: { passwordHash },
        create: { email, passwordHash, role: 'admin' },
    });
    console.warn(`✅ Admin user: ${admin.email}`);
    // ---- 2. Site settings ----
    const settings = {
        hero_name: 'John Doe',
        hero_title: 'Backend & DevOps Engineer',
        hero_bio: 'I build reliable, scalable backend systems and automate everything from CI/CD pipelines to cloud infrastructure.',
        about_text: 'Passionate backend engineer with 5+ years of experience in building distributed systems, REST APIs, and DevOps pipelines. I specialize in Node.js, Go, PostgreSQL, Docker, and Kubernetes.',
        contact_email: email,
    };
    for (const [key, value] of Object.entries(settings)) {
        await prisma.siteSetting.upsert({
            where: { key },
            update: { value },
            create: { key, value },
        });
    }
    console.warn(`✅ Site settings: ${Object.keys(settings).length} entries`);
    // ---- 3. Social links ----
    const socialLinks = [
        { platform: 'GitHub', url: 'https://github.com/johndoe', icon: 'github', order: 1 },
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/johndoe', icon: 'linkedin', order: 2 },
        { platform: 'Twitter', url: 'https://twitter.com/johndoe', icon: 'twitter', order: 3 },
    ];
    for (const link of socialLinks) {
        // Use upsert by platform name (not ideal but works for seed)
        const existing = await prisma.socialLink.findFirst({ where: { platform: link.platform } });
        if (existing) {
            await prisma.socialLink.update({ where: { id: existing.id }, data: link });
        }
        else {
            await prisma.socialLink.create({ data: link });
        }
    }
    console.warn(`✅ Social links: ${socialLinks.length} entries`);
    // ---- 4. Skill categories + skills ----
    const skillData = [
        {
            category: 'Backend',
            skills: [
                { name: 'Node.js', level: 5 },
                { name: 'NestJS', level: 5 },
                { name: 'Go', level: 4 },
                { name: 'Python', level: 3 },
            ],
        },
        {
            category: 'Databases',
            skills: [
                { name: 'PostgreSQL', level: 5 },
                { name: 'Redis', level: 4 },
                { name: 'MongoDB', level: 3 },
            ],
        },
        {
            category: 'DevOps & Cloud',
            skills: [
                { name: 'Docker', level: 5 },
                { name: 'Kubernetes', level: 4 },
                { name: 'GitHub Actions', level: 5 },
                { name: 'AWS', level: 4 },
                { name: 'Terraform', level: 3 },
            ],
        },
        {
            category: 'Frontend',
            skills: [
                { name: 'Next.js', level: 4 },
                { name: 'TypeScript', level: 5 },
                { name: 'React', level: 4 },
            ],
        },
    ];
    const skillMap = {};
    for (let catIdx = 0; catIdx < skillData.length; catIdx++) {
        const { category, skills } = skillData[catIdx];
        const cat = await prisma.skillCategory.upsert({
            where: { name: category },
            update: { order: catIdx },
            create: { name: category, order: catIdx },
        });
        for (let skillIdx = 0; skillIdx < skills.length; skillIdx++) {
            const s = skills[skillIdx];
            const skill = await prisma.skill.upsert({
                where: { categoryId_name: { categoryId: cat.id, name: s.name } },
                update: { level: s.level, order: skillIdx },
                create: { categoryId: cat.id, name: s.name, level: s.level, order: skillIdx },
            });
            skillMap[s.name] = skill.id;
        }
    }
    console.warn(`✅ Skills seeded`);
    // ---- 5. Experiences ----
    const experiences = [
        {
            company: 'TechCorp Inc.',
            role: 'Senior Backend Engineer',
            description: 'Led backend development for a high-traffic e-commerce platform serving 1M+ users. Migrated monolith to microservices, reducing p99 latency by 40%.',
            startDate: new Date('2022-01-01'),
            endDate: null,
            isCurrent: true,
        },
        {
            company: 'StartupXYZ',
            role: 'Backend Engineer',
            description: 'Built the core API from scratch using Node.js and PostgreSQL. Set up CI/CD pipelines with GitHub Actions and deployed on AWS ECS.',
            startDate: new Date('2020-03-01'),
            endDate: new Date('2021-12-31'),
            isCurrent: false,
        },
        {
            company: 'WebAgency Ltd.',
            role: 'Junior Developer',
            description: 'Developed REST APIs and maintained PostgreSQL databases for various client projects. First exposure to Docker and infrastructure-as-code.',
            startDate: new Date('2019-01-01'),
            endDate: new Date('2020-02-28'),
            isCurrent: false,
        },
    ];
    for (const exp of experiences) {
        const existing = await prisma.experience.findFirst({
            where: { company: exp.company, role: exp.role },
        });
        if (!existing) {
            await prisma.experience.create({ data: exp });
        }
    }
    console.warn(`✅ Experiences seeded`);
    // ---- 6. Projects ----
    const projects = [
        {
            title: 'Distributed Task Queue',
            slug: 'distributed-task-queue',
            description: 'A high-performance distributed task queue built with Node.js, Redis, and BullMQ. Supports priority queues, retries, and dead-letter queues. Processes 50k+ jobs/minute in production.',
            liveUrl: null,
            repoUrl: 'https://github.com/johndoe/task-queue',
            featured: true,
            order: 0,
            skills: ['Node.js', 'Redis', 'TypeScript', 'Docker'],
        },
        {
            title: 'K8s Operator for Database Backups',
            slug: 'k8s-backup-operator',
            description: 'A Kubernetes operator written in Go that automates PostgreSQL and MongoDB backups. Supports S3, GCS, and Azure Blob storage. Configurable retention policies.',
            liveUrl: null,
            repoUrl: 'https://github.com/johndoe/k8s-backup-operator',
            featured: true,
            order: 1,
            skills: ['Go', 'Kubernetes', 'PostgreSQL'],
        },
        {
            title: 'Portfolio Website',
            slug: 'portfolio-website',
            description: 'This very website! Built as a monorepo with Next.js frontend and NestJS API backend. Features an admin CMS for managing content without touching code.',
            liveUrl: 'https://johndoe.dev',
            repoUrl: 'https://github.com/johndoe/portfolio',
            featured: true,
            order: 2,
            skills: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Docker'],
        },
    ];
    for (const project of projects) {
        const { skills: projectSkillNames, ...projectData } = project;
        const existing = await prisma.project.findUnique({ where: { slug: projectData.slug } });
        // Collect skill IDs that exist in our seeded skills
        const skillIds = projectSkillNames
            .map((name) => skillMap[name])
            .filter((id) => id !== undefined);
        if (!existing) {
            await prisma.project.create({
                data: {
                    ...projectData,
                    skills: {
                        create: skillIds.map((skillId) => ({
                            skill: { connect: { id: skillId } },
                        })),
                    },
                },
            });
        }
    }
    console.warn(`✅ Projects seeded`);
    console.warn('\n🎉 Seed complete!');
    console.warn(`   Admin email:    ${email}`);
    console.warn(`   Admin password: ${password}`);
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map