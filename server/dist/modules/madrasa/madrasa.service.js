"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MadrasaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MadrasaService = exports.RENOWNED_QARIS = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
exports.RENOWNED_QARIS = [
    {
        id: "alafasy",
        reciterId: 7,
        nameEnglish: "Mishary Rashid Alafasy",
        nameArabic: "مشاري راشد العفاسي",
        nameMalayalam: "മിശാരി റാശിദ് അൽ-അഫാസി",
        style: "Murattal",
        serverSubfolder: "Alafasy_128kbps",
        avatarUrl: "https://images.quran.com/reciters/7/mishari-alafasy.jpg",
    },
    {
        id: "abdul-basit-mujawwad",
        reciterId: 1,
        nameEnglish: "Abdul Basit (Mujawwad)",
        nameArabic: "عبد الباسط عبد الصمد",
        nameMalayalam: "അബ്ദുൽ ബാസിത് അബ്ദുസ്സമദ് (മുജവ്വദ്)",
        style: "Mujawwad",
        serverSubfolder: "Abdul_Basit_Mujawwad_128kbps",
        avatarUrl: "https://images.quran.com/reciters/1/abdul-basit.jpg",
    },
    {
        id: "al-husary",
        reciterId: 5,
        nameEnglish: "Mahmoud Khalil Al-Husary",
        nameArabic: "محمود خليل الحصري",
        nameMalayalam: "മഹ്മൂദ് ഖലീൽ അൽ-ഹുസരി (തജ്‌വീദ് മാസ്റ്റർ)",
        style: "Murattal / Tajweed Teacher",
        serverSubfolder: "Husary_128kbps",
        avatarUrl: "https://images.quran.com/reciters/5/mahmoud-khalil-al-husary.jpg",
    },
    {
        id: "shatri",
        reciterId: 4,
        nameEnglish: "Abu Bakr Al-Shatri",
        nameArabic: "أبو بكر الشاطري",
        nameMalayalam: "അബൂബക്കർ അൽ-ശാത്വിരി",
        style: "Murattal",
        serverSubfolder: "Abu_Bakr_Ash-Shaatree_128kbps",
        avatarUrl: "https://images.quran.com/reciters/4/abu-bakr-al-shatri.jpg",
    },
];
let MadrasaService = MadrasaService_1 = class MadrasaService {
    prisma;
    logger = new common_1.Logger(MadrasaService_1.name);
    quranClient = null;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        await this.initQuranClient();
        try {
            await this.seedInitialMadrasaData();
            await this.seedAlFatihahCourseData();
        }
        catch (err) {
            this.logger.warn(`Initial madrasa seed warning: ${err.message}. Seeding will trigger on demand.`);
        }
    }
    async initQuranClient() {
        try {
            const clientId = process.env.QF_CLIENT_ID;
            const clientSecret = process.env.QF_CLIENT_SECRET;
            if (clientId && clientSecret) {
                const qServer = require("@quranjs/api/server");
                this.quranClient = qServer.createServerClient({
                    clientId,
                    clientSecret,
                });
                this.logger.log("Quran Foundation API Server Client successfully initialized.");
            }
        }
        catch (err) {
            this.logger.warn(`Quran Foundation SDK init note (fallback audio enabled): ${err.message}`);
        }
    }
    formatSubject(s) {
        if (!s)
            return s;
        return {
            ...s,
            titleEn: s.englishTitle || s.titleEn || "",
            titleMl: s.malayalamTitle || s.titleMl || "",
            arabicTitle: s.arabicName || s.arabicTitle || "",
            descEn: s.shortDescEn || s.descEn || "",
            descMl: s.shortDescMl || s.descMl || "",
            badgeText: s.badgeEn || s.badgeText || s.englishTitle || "",
            gradient: s.bgGradient || s.gradient || "bg-gradient-to-br from-[#F0E9FF] to-[#E3D4FF]",
            accentColor: s.accentBg || s.accentColor || "bg-[#7857E8]",
            topicsCount: s.topics?.length || 0,
            topics: (s.topics || []).map((t) => ({
                ...t,
                description: t.descEn || t.description || t.titleEn || "",
                iconName: t.icon || t.iconName || "📜",
            })),
        };
    }
    async getSubjects() {
        let subjects = await this.prisma.madrasaSubject.findMany({
            orderBy: { displayOrder: "asc" },
            include: {
                topics: {
                    orderBy: { order: "asc" },
                },
            },
        });
        if (subjects.length === 0) {
            await this.seedInitialMadrasaData();
            subjects = await this.prisma.madrasaSubject.findMany({
                orderBy: { displayOrder: "asc" },
                include: {
                    topics: {
                        orderBy: { order: "asc" },
                    },
                },
            });
        }
        return subjects.map((s) => this.formatSubject(s));
    }
    async getSubjectByKey(key) {
        const subject = await this.prisma.madrasaSubject.findUnique({
            where: { key },
            include: {
                topics: {
                    orderBy: { order: "asc" },
                },
            },
        });
        if (!subject) {
            throw new common_1.NotFoundException(`Madrasa subject '${key}' not found.`);
        }
        return this.formatSubject(subject);
    }
    async createSubject(dto) {
        const englishTitle = (dto.englishTitle || dto.titleEn || "").trim();
        const malayalamTitle = (dto.malayalamTitle || dto.titleMl || "").trim();
        const arabicName = (dto.arabicName || dto.arabicTitle || "").trim();
        const badgeEn = dto.badgeEn || dto.badgeText || englishTitle;
        const badgeMl = dto.badgeMl || dto.badgeText || malayalamTitle;
        const shortDescEn = dto.shortDescEn || dto.descEn || englishTitle;
        const shortDescMl = dto.shortDescMl || dto.descMl || malayalamTitle;
        const bgGradient = dto.bgGradient || dto.gradient || "bg-gradient-to-br from-[#F0E9FF] to-[#E3D4FF]";
        const accentBg = dto.accentBg || dto.accentColor || "bg-[#7857E8]";
        const created = await this.prisma.madrasaSubject.create({
            data: {
                key: dto.key.trim().toLowerCase(),
                englishTitle,
                malayalamTitle,
                arabicName,
                icon: dto.icon || "📚",
                badgeEn,
                badgeMl,
                shortDescEn,
                shortDescMl,
                bgGradient,
                borderColor: dto.borderColor || "border-[#CBB5FF]",
                textColor: dto.textColor || "text-[#5B21B6]",
                accentBg,
                displayOrder: dto.displayOrder ?? 1,
            },
            include: { topics: true },
        });
        return this.formatSubject(created);
    }
    async updateSubject(id, dto) {
        const existing = await this.prisma.madrasaSubject.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Subject with ID '${id}' not found.`);
        }
        const data = {};
        if (dto.englishTitle || dto.titleEn)
            data.englishTitle = (dto.englishTitle || dto.titleEn).trim();
        if (dto.malayalamTitle || dto.titleMl)
            data.malayalamTitle = (dto.malayalamTitle || dto.titleMl).trim();
        if (dto.arabicName || dto.arabicTitle)
            data.arabicName = (dto.arabicName || dto.arabicTitle).trim();
        if (dto.icon)
            data.icon = dto.icon;
        if (dto.badgeEn || dto.badgeText)
            data.badgeEn = dto.badgeEn || dto.badgeText;
        if (dto.badgeMl)
            data.badgeMl = dto.badgeMl;
        if (dto.shortDescEn || dto.descEn)
            data.shortDescEn = dto.shortDescEn || dto.descEn;
        if (dto.shortDescMl || dto.descMl)
            data.shortDescMl = dto.shortDescMl || dto.descMl;
        if (dto.bgGradient || dto.gradient)
            data.bgGradient = dto.bgGradient || dto.gradient;
        if (dto.borderColor)
            data.borderColor = dto.borderColor;
        if (dto.textColor)
            data.textColor = dto.textColor;
        if (dto.accentBg || dto.accentColor)
            data.accentBg = dto.accentBg || dto.accentColor;
        if (dto.displayOrder !== undefined)
            data.displayOrder = dto.displayOrder;
        const updated = await this.prisma.madrasaSubject.update({
            where: { id },
            data,
            include: { topics: true },
        });
        return this.formatSubject(updated);
    }
    async deleteSubject(id) {
        const existing = await this.prisma.madrasaSubject.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException(`Subject with ID '${id}' not found.`);
        }
        return this.prisma.madrasaSubject.delete({ where: { id } });
    }
    async createTopic(subjectId, dto) {
        const subject = await this.prisma.madrasaSubject.findUnique({ where: { id: subjectId } });
        if (!subject) {
            throw new common_1.NotFoundException(`Subject with ID '${subjectId}' not found.`);
        }
        return this.prisma.madrasaCurriculumTopic.create({
            data: {
                subjectId,
                titleEn: dto.titleEn.trim(),
                titleMl: dto.titleMl.trim(),
                descEn: dto.descEn.trim(),
                descMl: dto.descMl.trim(),
                icon: dto.icon || "📜",
                order: dto.order ?? 1,
            },
        });
    }
    async updateTopic(topicId, dto) {
        const topic = await this.prisma.madrasaCurriculumTopic.findUnique({ where: { id: topicId } });
        if (!topic) {
            throw new common_1.NotFoundException(`Topic with ID '${topicId}' not found.`);
        }
        return this.prisma.madrasaCurriculumTopic.update({
            where: { id: topicId },
            data: {
                ...dto,
            },
        });
    }
    async deleteTopic(topicId) {
        const topic = await this.prisma.madrasaCurriculumTopic.findUnique({ where: { id: topicId } });
        if (!topic) {
            throw new common_1.NotFoundException(`Topic with ID '${topicId}' not found.`);
        }
        return this.prisma.madrasaCurriculumTopic.delete({ where: { id: topicId } });
    }
    async getFatihahVerses() {
        let verses = await this.prisma.fatihahVerseData.findMany({
            orderBy: { verseNumber: "asc" },
        });
        if (verses.length === 0) {
            await this.seedAlFatihahCourseData();
            verses = await this.prisma.fatihahVerseData.findMany({
                orderBy: { verseNumber: "asc" },
            });
        }
        return verses;
    }
    async updateFatihahVerse(verseId, dto) {
        const verse = await this.prisma.fatihahVerseData.findUnique({ where: { id: verseId } });
        if (!verse) {
            throw new common_1.NotFoundException(`Verse '${verseId}' not found.`);
        }
        return this.prisma.fatihahVerseData.update({
            where: { id: verseId },
            data: {
                ...dto,
            },
        });
    }
    getAvailableQaris() {
        return exports.RENOWNED_QARIS;
    }
    async getFatihahQiraat(qariId = "alafasy") {
        const qari = exports.RENOWNED_QARIS.find((q) => q.id === qariId) || exports.RENOWNED_QARIS[0];
        const baseUrl = `https://everyayah.com/data/${qari.serverSubfolder}`;
        const verses = [1, 2, 3, 4, 5, 6, 7].map((verseNum) => {
            const paddedVerse = String(verseNum).padStart(3, "0");
            return {
                verseNumber: verseNum,
                verseKey: `1:${verseNum}`,
                audioUrl: `${baseUrl}/001${paddedVerse}.mp3`,
            };
        });
        let qfChapterAudioUrl = null;
        if (this.quranClient) {
            try {
                const audioRes = await this.quranClient.content.v4.audio.chapterRecitation({
                    reciterId: qari.reciterId,
                    chapterNumber: 1,
                });
                if (audioRes?.audioUrl) {
                    qfChapterAudioUrl = audioRes.audioUrl;
                }
            }
            catch (err) {
                this.logger.debug(`QF Chapter recitation audio query: ${err.message}`);
            }
        }
        return {
            surah: {
                number: 1,
                nameArabic: "الفاتحة",
                nameEnglish: "Al-Fatihah",
                nameMalayalam: "അൽ-ഫാതിഹ",
                totalVerses: 7,
            },
            qari,
            fullSurahAudioUrl: qfChapterAudioUrl || `https://server8.mp3quran.net/afs/001.mp3`,
            verses,
        };
    }
    async seedInitialMadrasaData() {
        const count = await this.prisma.madrasaSubject.count();
        if (count > 0)
            return;
        this.logger.log("Seeding 5 core Madrasa subjects into Neon PostgreSQL database...");
        const initialSubjects = [
            {
                key: "tajweed",
                englishTitle: "Tajweed",
                malayalamTitle: "തജ്‌വീദ്",
                arabicName: "علم التجويد والترتيل",
                icon: "🎙️",
                badgeEn: "Quran Recitation",
                badgeMl: "ഖുർആൻ പാരായണം",
                shortDescEn: "Recite the Holy Quran with correct Makharij, Madd, and melodious Tilawah.",
                shortDescMl: "ഖുർആൻ അക്ഷരങ്ങൾ മഖ്റജുകളിൽ നിന്ന് ശരിയായി ഉച്ചരിച്ച് ഓതാൻ പഠിക്കാം.",
                bgGradient: "bg-gradient-to-br from-[#F0E9FF] to-[#E3D4FF]",
                borderColor: "border-[#CBB5FF]",
                textColor: "text-[#5B21B6]",
                accentBg: "bg-[#7857E8]",
                displayOrder: 1,
                topics: [
                    {
                        titleEn: "Surah Al-Fatihah Journey",
                        titleMl: "സൂറത്തുൽ ഫാതിഹ തജ്‌വീദ്",
                        descEn: "7 verses step-by-step: word analysis, Tajweed rules, audio check, and practice.",
                        descMl: "7 ആയത്തുകൾ ഓരോന്നായി: പദ വിശകലനം, തജ്‌വീദ് നിയമങ്ങൾ, ഓത്ത് പരിശീലനം.",
                        icon: "📜",
                        order: 1,
                    },
                    {
                        titleEn: "Makharij (Articulation Points)",
                        titleMl: "അക്ഷരങ്ങളുടെ മഖ്റജുകൾ",
                        descEn: "Throat, tongue, lips, and nasal sounds pronounced correctly.",
                        descMl: "തൊണ്ട, നാവ്, ചുണ്ടുകൾ, മൂക്ക് എന്നിവയിൽ നിന്നുള്ള അക്ഷരങ്ങളുടെ കൃത്യമായ ഉച്ചാരണം.",
                        icon: "🗣️",
                        order: 2,
                    },
                    {
                        titleEn: "Rules of Madd & Noon Sakin",
                        titleMl: "മദ്ദും നൂൻ സാകിനയും",
                        descEn: "Idgham, Ikhfa, Izhar, and stretching letters according to Tajweed rules.",
                        descMl: "ഇദ്ഗാം, ഇഖ്ഫാഅ്, ഇള്ഹാർ, മദ്ദ് തുടങ്ങിയ പ്രധാന തജ്‌വീദ് നിയമങ്ങൾ.",
                        icon: "🎶",
                        order: 3,
                    },
                ],
            },
            {
                key: "aqeedah",
                englishTitle: "Aqeedah",
                malayalamTitle: "അഖീദ",
                arabicName: "العقيدة والإيمان",
                icon: "🌙",
                badgeEn: "Pillars of Faith",
                badgeMl: "ഈമാൻ കാര്യങ്ങൾ",
                shortDescEn: "Belief in Allah, His Angels, Prophets, Books, and the Day of Judgment.",
                shortDescMl: "അല്ലാഹുവിലുള്ള വിശ്വാസം, മലക്കുകൾ, പ്രവാചകന്മാർ, ഗ്രന്ഥങ്ങൾ, അന്ത്യനാൾ.",
                bgGradient: "bg-gradient-to-br from-[#EBF5FF] to-[#D6EBFF]",
                borderColor: "border-[#B8DCFF]",
                textColor: "text-[#005299]",
                accentBg: "bg-[#0070D1]",
                displayOrder: 2,
                topics: [
                    {
                        titleEn: "6 Pillars of Iman",
                        titleMl: "ഈമാൻ കാര്യങ്ങൾ 6",
                        descEn: "Belief in Allah, Angels, Divine Books, Messengers, Day of Resurrection, and Qadar.",
                        descMl: "അല്ലാഹു, മലക്കുകൾ, വേദഗ്രന്ഥങ്ങൾ, പ്രവാചകന്മാർ, അന്ത്യദിനം, ഖദ്ർ എന്നിവയിലുള്ള വിശ്വാസം.",
                        icon: "✨",
                        order: 1,
                    },
                    {
                        titleEn: "Tawheed & Allah's Names",
                        titleMl: "തൗഹീദും അസ്മാഉൽ ഹുസ്നയും",
                        descEn: "Learning the beautiful names and perfect attributes of Allah.",
                        descMl: "അല്ലാഹുവിന്റെ 99 നാമങ്ങളും ഉത്തമ ഗുണങ്ങളും മനസ്സിലാക്കൽ.",
                        icon: "🌟",
                        order: 2,
                    },
                    {
                        titleEn: "Love for Prophet Muhammad ﷺ",
                        titleMl: "നബി ﷺ യോടുള്ള സ്നേഹം",
                        descEn: "Following the final Messenger and his noble teachings in our daily life.",
                        descMl: "അന്ത്യപ്രവാചകനെ ജീവനേക്കാൾ സ്നേഹിക്കലും ചര്യകൾ ജീവിതത്തിൽ പകർത്തലും.",
                        icon: "❤️",
                        order: 3,
                    },
                ],
            },
            {
                key: "fiqh",
                englishTitle: "Fiqh",
                malayalamTitle: "ഫിഖ്ഹ്",
                arabicName: "الفقه الإسلامي",
                icon: "💧",
                badgeEn: "Worship & Rules",
                badgeMl: "ശുദ്ധിയും നമസ്കാരവും",
                shortDescEn: "How to perform Wudu, offer 5 daily prayers, and practice Islamic etiquette.",
                shortDescMl: "വുളൂഅ്, 5 വഖ്ത് നമസ്കാരം, ആരാധനാ രീതികൾ, ഇസ്ലാമിക വിധിവിലക്കുകൾ.",
                bgGradient: "bg-gradient-to-br from-[#EAF8E8] to-[#D5F2D2]",
                borderColor: "border-[#B7E8B1]",
                textColor: "text-[#1C6918]",
                accentBg: "bg-[#287553]",
                displayOrder: 3,
                topics: [
                    {
                        titleEn: "Steps of Wudu (Ablution)",
                        titleMl: "വുളൂഇന്റെ ക്രമങ്ങൾ",
                        descEn: "Washing hands, mouth, face, arms, wiping head, and feet with pure intention.",
                        descMl: "കൈ കഴുകൽ, വായ കഴുകൽ, മുഖം, കൈകൾ, തല തടവൽ, കാലുകൾ കഴുകൽ എന്നിവ ക്രമത്തിൽ.",
                        icon: "💧",
                        order: 1,
                    },
                    {
                        titleEn: "5 Daily Prayers (Salah)",
                        titleMl: "5 നേരത്തെ നമസ്കാരങ്ങൾ",
                        descEn: "Subhi, Dhuhr, Asr, Maghrib, and Isha: timings, rak'ahs, and posture.",
                        descMl: "സുബ്ഹി, ദ്വുഹ്ർ, അസ്വർ, മഗ്‌രിബ്, ഇശാഅ്: സമയങ്ങളും റക്അത്തുകളും.",
                        icon: "🕌",
                        order: 2,
                    },
                    {
                        titleEn: "Cleanliness in Islam (Taharah)",
                        titleMl: "ശുചിത്വവും ത്വാഹറത്തും",
                        descEn: "Purity of body, clothes, and place of worship.",
                        descMl: "ശരീരം, വസ്ത്രം, പരിസരം എന്നിവ വൃത്തിയായി സൂക്ഷിക്കുന്നതിന്റെ പ്രാധാന്യം.",
                        icon: "✨",
                        order: 3,
                    },
                ],
            },
            {
                key: "lisanul-quran",
                englishTitle: "Lisanul Quran",
                malayalamTitle: "ലിസാനുൽ ഖുർആൻ",
                arabicName: "لسان القرآن المجيد",
                icon: "📖",
                badgeEn: "Quranic Arabic",
                badgeMl: "ഖുർആനിക ഭാഷ",
                shortDescEn: "Learn Arabic vocabulary, basic sentence structures, and Quranic words.",
                shortDescMl: "ഖുർആനിലെ പ്രധാന പദങ്ങൾ, അറബി അക്ഷരങ്ങൾ, പദാവലി, ലളിതമായ അർത്ഥങ്ങൾ.",
                bgGradient: "bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A]",
                borderColor: "border-[#FCD34D]",
                textColor: "text-[#92400E]",
                accentBg: "bg-[#D97706]",
                displayOrder: 4,
                topics: [
                    {
                        titleEn: "Core Quranic Words",
                        titleMl: "പ്രധാന ഖുർആൻ പദങ്ങൾ",
                        descEn: "High-frequency words in the Quran like Rabb, Kitab, Rahmah, and Qalb.",
                        descMl: "റബ്ബ്, കിതാബ്, റഹ്മത്ത്, ഖൽബ് തുടങ്ങിയ ഖുർആനിൽ ആവർത്തിച്ചു വരുന്ന പദങ്ങൾ.",
                        icon: "🔤",
                        order: 1,
                    },
                    {
                        titleEn: "Arabic Letters & Vowels",
                        titleMl: "അക്ഷരങ്ങളും ഹറകത്തുകളും",
                        descEn: "Mastering Fathah, Kasrah, Dammah, Sukun, and Tanween.",
                        descMl: "ഫത്ഹ്, കസ്റ്, ളമ്മ്, സുക്കൂൻ, തൻവീൻ എന്നിവ വ്യക്തമായി വായിക്കൽ.",
                        icon: "✍️",
                        order: 2,
                    },
                    {
                        titleEn: "Simple Meanings of Surahs",
                        titleMl: "സൂറത്തുകളുടെ ലളിതമായ അർത്ഥം",
                        descEn: "Word-by-word meaning of short Surahs recited in daily Salah.",
                        descMl: "നമസ്കാരത്തിൽ നാം പതിവായി ഓതുന്ന ചെറിയ സൂറത്തുകളുടെ ലളിതമായ അർത്ഥം.",
                        icon: "💡",
                        order: 3,
                    },
                ],
            },
            {
                key: "akhlaq",
                englishTitle: "Akhlaq",
                malayalamTitle: "അഖ്‌ലാഖ്",
                arabicName: "الأخلاق والآداب",
                icon: "💛",
                badgeEn: "Character & Ethics",
                badgeMl: "നല്ല സ്വഭാവങ്ങൾ",
                shortDescEn: "Kindness, honesty, respecting parents and teachers, and speaking the truth.",
                shortDescMl: "സത്യസന്ധത, മാതാപിതാക്കളെ ബഹുമാനിക്കൽ, കൂട്ടുകാരോടുള്ള സ്നേഹം, പുഞ്ചിരി.",
                bgGradient: "bg-gradient-to-br from-[#FFEDD5] to-[#FED7AA]",
                borderColor: "border-[#FDBA74]",
                textColor: "text-[#9A3412]",
                accentBg: "bg-[#EA580C]",
                displayOrder: 5,
                topics: [
                    {
                        titleEn: "Kindness to Parents (Birr al-Walidayn)",
                        titleMl: "മാതാപിതാക്കളോടുള്ള നന്മ",
                        descEn: "Obeying with a smile, helping at home, and making Dua for them.",
                        descMl: "മാതാപിതാക്കളെ സഹായിക്കൽ, പുഞ്ചിരിയോടെ സംസാരിക്കൽ, അവർക്കായി പ്രാർത്ഥിക്കൽ.",
                        icon: "🏡",
                        order: 1,
                    },
                    {
                        titleEn: "Greeting with Salam & Smiling",
                        titleMl: "സലാം പറയലും പുഞ്ചിരിയും",
                        descEn: "Spreading peace and kindness whenever meeting friends and elders.",
                        descMl: "കൂട്ടുകാരെയും മുതിർന്നവരെയും കാണുമ്പോൾ സലാം പറയുക, പുഞ്ചിരിക്കുക.",
                        icon: "😊",
                        order: 2,
                    },
                    {
                        titleEn: "Truthfulness & Keeping Trusts",
                        titleMl: "സത്യസന്ധതയും അമാനത്തും",
                        descEn: "Always speaking the truth and returning things borrowed safely.",
                        descMl: "എപ്പോഴും സത്യം പറയുക, കടം വാങ്ങിയ വസ്തുക്കൾ ഭദ്രമായി തിരികെ നൽകുക.",
                        icon: "🤝",
                        order: 3,
                    },
                ],
            },
        ];
        for (const s of initialSubjects) {
            const { topics, ...subjData } = s;
            const created = await this.prisma.madrasaSubject.create({
                data: subjData,
            });
            for (const t of topics) {
                await this.prisma.madrasaCurriculumTopic.create({
                    data: {
                        subjectId: created.id,
                        ...t,
                    },
                });
            }
        }
        this.logger.log("Successfully seeded 5 Madrasa subjects and curriculum topics.");
    }
    async seedAlFatihahCourseData() {
        const count = await this.prisma.fatihahVerseData.count();
        if (count > 0)
            return;
        this.logger.log("Seeding Surah Al-Fatihah 7 verses into Neon PostgreSQL database...");
        const verses = [
            {
                id: "fatihah-1",
                verseNumber: 1,
                arabicText: "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
                englishTranslation: "In the Name of Allah—the Most Compassionate, Most Merciful.",
                malayalamTranslation: "പരമകാരുണികനും കരുണാനിധിയുമായ അല്ലാഹുവിന്റെ നാമത്തിൽ.",
                transliteration: "Bismillāhir-Raḥmānir-Raḥīm",
            },
            {
                id: "fatihah-2",
                verseNumber: 2,
                arabicText: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
                englishTranslation: "All praise is for Allah—Lord of all worlds.",
                malayalamTranslation: "സ്തുതിയെല്ലാം സർവ്വലോക പരിപാലകനായ അല്ലാഹുവിനാകുന്നു.",
                transliteration: "Al-ḥamdu lillāhi Rabbil-ʿālamīn",
            },
            {
                id: "fatihah-3",
                verseNumber: 3,
                arabicText: "ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
                englishTranslation: "The Most Compassionate, Most Merciful.",
                malayalamTranslation: "പരമകാരുണികനും കരുണാനിധിയുമായവൻ.",
                transliteration: "Ar-Raḥmānir-Raḥīm",
            },
            {
                id: "fatihah-4",
                verseNumber: 4,
                arabicText: "مَـٰلِكِ يَوْمِ ٱلدِّينِ",
                englishTranslation: "Master of the Day of Judgment.",
                malayalamTranslation: "പ്രതിഫല ദിവസത്തിന്റെ ഉടമസ്ഥനായവൻ.",
                transliteration: "Māliki Yawmid-Dīn",
            },
            {
                id: "fatihah-5",
                verseNumber: 5,
                arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
                englishTranslation: "You alone we worship and You alone we ask for help.",
                malayalamTranslation: "നിന്നെ മാത്രം ഞങ്ങൾ ആരാധിക്കുന്നു, നിന്നോട് മാത്രം ഞങ്ങൾ സഹായം തേടുന്നു.",
                transliteration: "Iyyāka naʿbudu wa-iyyāka nastaʿīn",
            },
            {
                id: "fatihah-6",
                verseNumber: 6,
                arabicText: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
                englishTranslation: "Guide us along the Straight Path.",
                malayalamTranslation: "ഞങ്ങളെ നീ നേരായ പാതയിൽ നയിക്കേണമേ.",
                transliteration: "Ihdinaṣ-ṣirāṭal-mustaqīm",
            },
            {
                id: "fatihah-7",
                verseNumber: 7,
                arabicText: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
                englishTranslation: "The Path of those You have blessed—not those who have incurred Your wrath, or those who have gone astray.",
                malayalamTranslation: "നീ അനുഗ്രഹിച്ചവരുടെ പാതയിൽ; കോപത്തിനിരയായവരുടെയോ വഴിപിഴച്ചവരുടെയോ പാതയിലല്ല.",
                transliteration: "Ṣirāṭal-ladhīna anʿamta ʿalayhim ghayril-maghḍūbi ʿalayhim wa-laḍ-ḍāllīn",
            },
        ];
        for (const v of verses) {
            await this.prisma.fatihahVerseData.create({
                data: {
                    ...v,
                    audioUrl: `https://everyayah.com/data/Alafasy_128kbps/00100${v.verseNumber}.mp3`,
                },
            });
        }
        this.logger.log("Successfully seeded 7 Al-Fatihah verses into database.");
    }
};
exports.MadrasaService = MadrasaService;
exports.MadrasaService = MadrasaService = MadrasaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MadrasaService);
//# sourceMappingURL=madrasa.service.js.map