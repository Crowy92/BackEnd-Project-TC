const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('can format a date from a array with a single timestamp to a javascript date object', () => {
    const dates = [{
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: 1471522072389,
    }];
    const actual = formatDates(dates);
    const expected = new Date(1471522072389)
    expect(actual[0].created_at).to.eql(expected)
  });
  it('can format a date from a array with multiple timestamps to a javascript date object', () => {
    const dates = [{
      title: 'Running a Node App',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
      created_at: 1471522072389,
    },
    {
      title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
      topic: 'coding',
      author: 'jessjelly',
      body:
        'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
      created_at: 1500584273256,
    }];
    const actual = formatDates(dates);
    const expected = new Date(1500584273256)
    expect(actual[1].created_at).to.eql(expected)
  });
});

describe('makeRefObj', () => {
  it('converts an array of objects in to a reference object', () => {
    expect(makeRefObj([{ article_id: 1, title: 'A' }])).to.eql({ A: 1 });
    expect(makeRefObj([{ article_id: 1, title: 'A' }, { article_id: 2, title: 'B' }]))
      .to.eql({ A: 1, B: 2 });
  });
  it('can sift through a larger object to find info to make a reference object', () => {
    expect(makeRefObj([{
      article_id: 1,
      title: '22 Amazing open source React projects',
      topic: 'coding',
      author: 'happyamy2016',
      body:
        'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
      created_at: 1500659650346,
    },
    {
      article_id: 2,
      title: 'Making sense of Redux',
      topic: 'coding',
      author: 'jessjelly',
      body:
        'When I first started learning React, I remember reading lots of articles about the different technologies associated with it. In particular, this one article stood out. It mentions how confusing the ecosystem is, and how developers often feel they have to know ALL of the ecosystem before using React. And as someone who’s used React daily for the past 8 months or so, I can definitely say that I’m still barely scratching the surface in terms of understanding how the entire ecosystem works! But my time spent using React has given me some insight into when and why it might be appropriate to use another technology — Redux (a variant of the Flux architecture).',
      created_at: 1514093931240,
    }])).to.eql({ '22 Amazing open source React projects': 1, 'Making sense of Redux': 2 });
  });
});

describe('formatComments', () => {
  it('combines a ref grid to replace the title with a article_id and rename two keys', () => {
    const ref = { A: 1, B: 2 };
    const comments = [
      {
        body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        belongs_to: 'A',
        created_by: 'tickle122',
        votes: -1,
        created_at: 1471522072389
      },
      {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        belongs_to: 'B',
        created_by: 'grumpy19',
        votes: 7,
        created_at: 1471522072389
      }]
    const expected = [
      {
        body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        article_id: 1,
        author: 'tickle122',
        votes: -1,
        created_at: (new Date(1471522072389))
      },
      {
        body: 'Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.',
        article_id: 2,
        author: 'grumpy19',
        votes: 7,
        created_at: (new Date(1471522072389))
      }]
    expect(formatComments(comments, ref)).to.eql(expected)
  });
  it('also updates the time value of the article to a json time object', () => {
    const ref = { A: 1, B: 2 };
    const comments = [{
      body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
      belongs_to: 'A',
      created_by: 'tickle122',
      votes: -1, created_at: 1471522072389
    }]
    const expected = [
      {
        body: 'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
        article_id: 1,
        author: 'tickle122',
        votes: -1, created_at: (new Date(1471522072389))
      }]
    expect(formatComments(comments, ref)).to.eql(expected)
  });
});
