import { describe, expect, it } from 'vitest';

import { urlEmbeble } from '../embed';

describe('urlEmbeble · YouTube', () => {
  it('watch?v=', () => {
    expect(urlEmbeble('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    );
  });

  it('youtu.be', () => {
    expect(urlEmbeble('https://youtu.be/dQw4w9WgXcQ', 'youtube')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    );
  });

  it('ya viene como /embed/', () => {
    expect(urlEmbeble('https://www.youtube.com/embed/dQw4w9WgXcQ', 'youtube')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    );
  });

  it('/shorts/', () => {
    expect(urlEmbeble('https://www.youtube.com/shorts/dQw4w9WgXcQ', 'youtube')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    );
  });

  it('sin id reconocible, null', () => {
    expect(urlEmbeble('https://www.youtube.com/', 'youtube')).toBeNull();
  });
});

describe('urlEmbeble · Vimeo', () => {
  it('vimeo.com/ID', () => {
    expect(urlEmbeble('https://vimeo.com/76979871', 'vimeo')).toBe(
      'https://player.vimeo.com/video/76979871',
    );
  });

  it('ya viene como player.vimeo.com', () => {
    expect(urlEmbeble('https://player.vimeo.com/video/76979871', 'vimeo')).toBe(
      'https://player.vimeo.com/video/76979871',
    );
  });
});

describe('urlEmbeble · robustez', () => {
  it('sin video, null', () => {
    expect(urlEmbeble(null, null)).toBeNull();
  });

  it('origen «otro» no produce embed: se deja como enlace normal', () => {
    expect(urlEmbeble('https://misitio.com/video.mp4', 'otro')).toBeNull();
  });

  it('una URL rota no lanza', () => {
    expect(() => urlEmbeble('no-es-una-url', 'youtube')).not.toThrow();
    expect(urlEmbeble('no-es-una-url', 'youtube')).toBeNull();
  });
});
