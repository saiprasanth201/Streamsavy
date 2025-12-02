const sampleDownloads = [
  { id: 1, title: 'The Sovereign', progress: 'Ready to watch offline' },
  { id: 2, title: 'Nebula Knights', progress: 'Downloading 68%' },
  { id: 3, title: 'Echoes of Mars', progress: 'Queued' }
];

const Downloads = () => {
  return (
    <div className="page page--downloads">
      <div className="page__content">
        <header className="page__header">
          <h1>Downloads</h1>
          <p>Track the TV shows and movies you have saved for offline viewing.</p>
        </header>

        <section className="card">
          <h2 className="card__title">Offline Library</h2>
          <ul className="card__list">
            {sampleDownloads.map((item) => (
              <li key={item.id}>
                <span className="card__list-title">{item.title}</span>
                <span className="card__list-meta">{item.progress}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Downloads;
