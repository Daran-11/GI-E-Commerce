'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

function CertificateSelector({ userId }) {
  const [certificates, setCertificates] = useState([]);
  const [selectedStandards, setSelectedStandards] = useState([]);
  const { data: session, status } = useSession()
  
  userId = session.user.id;

  useEffect(() => {
    // Fetch the available certificates for the farmer
    async function fetchCertificates() {
      const response = await fetch('/api/users/{userId}/certificates');
      const data = await response.json();
      setCertificates(data);
    }

    fetchCertificates();
  }, [userId]);

  const handleSelectStandard = (standard) => {
    if (selectedStandards.includes(standard)) {
      setSelectedStandards(selectedStandards.filter((item) => item !== standard));
    } else {
      setSelectedStandards([...selectedStandards, standard]);
    }
  };

  return (
    <div>
      <h3>Select Product Standards</h3>
      <div>
        {certificates.map((cert) => (
          <div key={cert.id}>
            {cert.standards.map((standard, index) => (
              <label key={index}>
                <input
                  type="checkbox"
                  value={standard}
                  checked={selectedStandards.includes(standard)}
                  onChange={() => handleSelectStandard(standard)}
                />
                {standard}
              </label>
            ))}
          </div>
        ))}
      </div>
      <p>Selected Standards: {selectedStandards.join(', ')}</p>
    </div>
  );
}

export default CertificateSelector;
