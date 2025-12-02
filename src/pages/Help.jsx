import { FiMail, FiMessageCircle, FiBookOpen } from 'react-icons/fi';

const Help = () => (
  <div className="page page--help">
    <div className="page__content">
      <header className="page__header">
        <h1>Help Center</h1>
        <p>Need assistance? Start with the resources below or reach our support team.</p>
      </header>

      <section className="card">
        <h2 className="card__title">Support Options</h2>
        <ul className="card__list">
          <li>
            <FiBookOpen />
            <span>
              <strong>Knowledge base:</strong> Browse quick answers to common product questions.
            </span>
          </li>
          <li>
            <FiMessageCircle />
            <span>
              <strong>Community:</strong> Join fellow fans in the StreamSavvy discussion forum.
            </span>
          </li>
          <li>
            <FiMail />
            <span>
              <strong>Email support:</strong> support@streamsavvy.app
            </span>
          </li>
        </ul>
      </section>
    </div>
  </div>
);

export default Help;
