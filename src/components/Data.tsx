import { useEffect, useState } from 'react';
import css from '../styles/Data.module.css';
import Loading from './Loading';

export default () => {
  const [domain, setDomain] = useState('');
  const [list, setList] = useState<{ name: string; favicon: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const listFromLocalStorage = localStorage.getItem('list');
    if (listFromLocalStorage) setList(JSON.parse(listFromLocalStorage));
  }, []);

  async function handleBlock() {
    setLoading(true);
    const exist = list.find((item) => item.name === domain);

    if (exist) {
      new Notification('REDPILL', {
        body: `${domain} is already blocked`,
      });
      setLoading(false);
      return;
    }

    try {
      await window.api.blockDomain(domain);
      const d = {
        name: domain,
        favicon: `https://icon.horse/icon/${domain}`,
      };

      setList([d, ...list]);
      localStorage.setItem('list', JSON.stringify([d, ...list]));
      setDomain('');

      new Notification('REDPILL', {
        body: `${domain} is NOW BLOCKED`,
      });
      setLoading(false);
    } catch (_) {
      setLoading(false);
    }
  }

  const validDomain = () =>
    /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(
      domain
    );

  return (
    <div className={css.container}>
      <div className={css.form}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <input
              placeholder="Type Domain to block"
              onChange={(e) => setDomain(e.target.value)}
              value={domain}
            />
            <button
              onClick={handleBlock}
              disabled={domain === '' || !validDomain()}
            >
              Block
            </button>
          </>
        )}
      </div>
      {list.length > 0 ? (
        <div className={css.list}>
          <ul>
            {list.map((d) => (
              <li key={d.name}>
                <p>{d.name}</p>
                <img src={d.favicon} height={20} width={20} />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className={css.empty}>Empty</div>
      )}
    </div>
  );
};
