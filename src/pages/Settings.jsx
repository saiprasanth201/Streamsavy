const preferences = [
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Receive alerts about new releases, recommendations, and account activity.'
  },
  {
    id: 'autoplay',
    title: 'Autoplay previews',
    description: 'Automatically play trailers when browsing the catalog.'
  },
  {
    id: 'data-saver',
    title: 'Data saver',
    description: 'Reduce video quality on mobile to save data usage.'
  }
];

const Settings = () => (
  <div className="page page--settings">
    <div className="page__content">
      <header className="page__header">
        <h1>Settings</h1>
        <p>Adjust streaming preferences and tailor StreamSavvy to your experience.</p>
      </header>

      <section className="card">
        <h2 className="card__title">Preferences</h2>
        <ul className="card__list">
          {preferences.map((item) => (
            <li key={item.id}>
              <span className="card__list-title">{item.title}</span>
              <span className="card__list-meta">{item.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  </div>
);

export default Settings;
