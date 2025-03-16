import { NextRequest, NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export async function POST(request: NextRequest) {
  try {
    const { prompt, count = 1, aspectRatio = '1:1', style = 'none' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Initialize AWS Bedrock client
    const client = new BedrockRuntimeClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    const modelId = 'stability.stable-diffusion-xl-v1';
    
    // Prepare API requests for the specified number of images
    const imagePromises = Array.from({ length: Math.min(count, 3) }, async () => {
      // Calculate dimensions based on aspect ratio
      let width = 1024;
      let height = 1024;
      
      switch (aspectRatio) {
        case '16:9':
          width = 1024;
          height = 576;
          break;
        case '9:16':
          width = 576;
          height = 1024;
          break;
        case '4:3':
          width = 1024;
          height = 768;
          break;
        case '3:4':
          width = 768;
          height = 1024;
          break;
        default: // 1:1
          width = 1024;
          height = 1024;
      }
      
      const command = new InvokeModelCommand({
        modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          text_prompts: [
            {
              text: style !== 'none' ? `${prompt}, in the style of ${style}` : prompt,
              weight: 1.0
            }
          ],
          cfg_scale: 8,
          height,
          width,
          steps: 50,
          seed: Math.floor(Math.random() * 4294967295)
        }),
      });

      const response = await client.send(command);
      const responseBody = new TextDecoder().decode(response.body);
      const parsedResponse = JSON.parse(responseBody);
      
      return parsedResponse.artifacts?.[0]?.base64 || '';
    });

    // Execute all requests in parallel
    const images = await Promise.all(imagePromises);

    return NextResponse.json({ images });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: errorMessage || 'Failed to generate images' },
      { status: 500 }
    );
  }
}