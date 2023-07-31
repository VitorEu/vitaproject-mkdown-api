'use client'

import { PrismaClient, mkdown_content } from '@prisma/client'

const prisma = new PrismaClient()

interface ContentService {
    saveContent(content: mkdown_content): Promise<mkdown_content>;
    getContent(uuid: string): Promise<mkdown_content | undefined>;
}

const saveContent = async (content: mkdown_content): Promise<mkdown_content> => {
    
    const existentContent = await getContent(content.uuid);
    if (!existentContent) {
        await prisma.mkdown_content.create({
            data: {
                uuid: content.uuid,
                text_content: content.text_content
            }
        })
    } else {
        await prisma.mkdown_content.updateMany({
            data: {
                uuid: content.uuid,
                text_content: content.text_content
            },
            where: {
                uuid: content.uuid
            }
        });
    }

    const queryResult = await prisma.mkdown_content.findFirst({
        select: {
            id: true,
            text_content: true,
            uuid: true
        }, 
        where: {
            uuid: content.uuid
        }
    })

    if (!queryResult) return {} as mkdown_content;

    return {
        id: queryResult.id,
        uuid: queryResult.uuid,
        text_content: queryResult.text_content
    }
}

const getContent = async (uuid: string): Promise<mkdown_content | undefined>  => {
    const queryResult = await prisma.mkdown_content.findFirst({
        select: {
            id: true,
            text_content: true,
            uuid: true
        },
        where: {
            uuid: uuid
        }
    })

    return queryResult || undefined;
}

const contentService: ContentService = {
    saveContent,
    getContent
}

export default contentService;