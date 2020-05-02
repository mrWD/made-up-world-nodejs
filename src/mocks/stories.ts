import faker from 'faker';
import models from '../models';
import transliter from '../utils/transliter';

const owner = '5e9a1a6820842e44a5b2b0e9';
const STORY_COUNT: 200 = 200;

const stories = async (isStart = false): Promise<void> => {
  if (!isStart) return;

  try {
    await models.Page.deleteMany({});

    Array.from({ length: STORY_COUNT }).forEach(async () => {
      const title = faker.lorem.words(5);

      const page = await models.Page.create({
        title,
        storyURL: `${transliter.getSlugString(title)}-${Date.now().toString(36)}`,
        body: faker.lorem.words(50),
        owner,
        isFirst: true,
        isPublished: true,
      });

      const page2 = await models.Page.create({
        title: page.title,
        body: 'You went left',
        storyURL: page.storyURL,
        owner: page.owner,
        isPublished: true,
      });

      const page3 = await models.Page.create({
        title: page.title,
        body: 'You went right',
        storyURL: page.storyURL,
        owner: page.owner,
        isPublished: true,
      });

      await models.Page.findByIdAndUpdate(
        page.id,
        {
          nextPages: [page2.id, page3.id],
          options: ['Go left', 'Go right'],
        }
      );
    });

    console.info('Stories mocks passed successfully!');
  } catch (err) {
    console.error(err);
  }
};

export default stories;
