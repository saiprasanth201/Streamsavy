import { useMemo } from 'react';
import { FiCheckCircle, FiClock, FiShield } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext.jsx';

const Subscription = () => {
  const { hasCompletedPayment } = useAuth();

  const plan = useMemo(
    () => ({
      name: 'StreamSavvy Premium',
      renewal: 'Renews automatically every month',
      status: hasCompletedPayment ? 'Active' : 'Pending activation'
    }),
    [hasCompletedPayment]
  );

  return (
    <div className="page page--subscription">
      <div className="page__content">
        <header className="page__header">
          <h1>Subscription</h1>
          <p>Manage your membership and review the benefits included in your plan.</p>
        </header>

        <section className="card">
          <h2 className="card__title">Current Plan</h2>
          <ul className="card__list">
            <li>
              <FiShield />
              <span>
                <strong>Plan:</strong> {plan.name}
              </span>
            </li>
            <li>
              <FiClock />
              <span>
                <strong>Renewal:</strong> {plan.renewal}
              </span>
            </li>
            <li>
              <FiCheckCircle />
              <span>
                <strong>Status:</strong> {plan.status}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Subscription;
