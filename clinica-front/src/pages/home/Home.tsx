import { useEffect, useState } from 'react';
import styles from './Home.module.css';
import { get } from '../../services/api';
import type { Doctor } from '../../models/Doctor';

export function Home() {
  const [specialties, setSpecialties] = useState<string[]>([]);

  useEffect(() => {
    get<Doctor[]>('/doctors')
      .then((data) => {
        const unique = Array.from(new Set(data.map((d) => d.specialty))).sort();
        setSpecialties(unique);
      })
      .catch((err) => {
        console.error('Erro ao buscar médicos:', err);
      });
  }, []);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          {/* <div className={styles.cross}></div> */}
          <img src="/cross.png" alt="" className={styles.cross} />
          <h1>Ruby Medic Center</h1>
        </div>
        <p className={styles.subtitle}>
          Cuidando da sua saúde com tecnologia e carinho.
        </p>
      </header>

      <section className={styles.section}>
        <h2>Quem somos</h2>
        <p>
          Somos uma clínica moderna e humanizada, focada em proporcionar atendimento médico de qualidade para você e sua família.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Nossas especialidades</h2>
        {specialties.length === 0 ? (
          <p>Carregando especialidades...</p>
        ) : (
          <ul>
            {specialties.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        )}
      </section>

      <section className={styles.section}>
        <h2>Agende sua consulta</h2>
        <p>
          Escolha o médico da especialidade desejada e agende sua consulta de forma rápida e fácil.
        </p>
      </section>
    </div>
  );
}
