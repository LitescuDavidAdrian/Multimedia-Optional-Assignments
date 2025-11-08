document.addEventListener('DOMContentLoaded', async () => {
    const albumsRow = document.getElementById('albumsRow');
    const modal = new bootstrap.Modal(document.getElementById('tracklistModal'));
    const modalTitle = document.getElementById('tracklistModalLabel');
    const modalTracklist = document.getElementById('modalTracklist');
    const modalStats = document.getElementById('modalStats');
    const modalPlayFirst = document.getElementById('modalPlayFirst');

    const resp = await fetch('assets/data/library.json');
    if (!resp.ok) {
        albumsRow.innerHTML = `<div class="col-12"><div class="alert alert-danger">Failed to load library.json</div></div>`;
        return;
    }
    const albums = await resp.json();

    function createAlbumCol(album) {
        const col = document.createElement('div');
        col.className = 'col-xl-2 col-md-3 col-sm-6 col-12 mb-4';

        const card = document.createElement('div');
        card.className = 'card h-100 album-card';

        const thumb = document.createElement('div');
        thumb.className = 'card-thumb';
        thumb.style.backgroundImage = `url('assets/img/${album.thumbnail}')`;
        card.appendChild(thumb);

        const body = document.createElement('div');
        body.className = 'card-body d-flex flex-column';

        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = album.artist;

        const text = document.createElement('p');
        text.className = 'card-text';
        text.textContent = album.album;

        const footer = document.createElement('div');
        footer.className = 'card-footer bg-transparent border-0';

        const btn = document.createElement('button');
        btn.className = 'btn btn-primary w-100';
        btn.textContent = 'View Tracklist';
        btn.dataset.albumId = album.id;

        footer.appendChild(btn);

        body.appendChild(title);
        body.appendChild(text);

        card.appendChild(body);
        card.appendChild(footer);
        col.appendChild(card);

        btn.addEventListener('click', () => openModalForAlbum(album));

        return col;
    }

    albums.forEach(album => {
        albumsRow.appendChild(createAlbumCol(album));
    });

    function openModalForAlbum(album) {
        modalTitle.textContent = `${album.artist} - ${album.album}`;

        modalStats.innerHTML = `
            <p><strong>Total tracks:</strong> ${album.tracklist.length}</p>
        `;

        modalTracklist.innerHTML = '';
        const ol = document.createElement('ol');
        ol.className = 'list-group list-group-numbered';
        album.tracklist.forEach(track => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-start';
            const a = document.createElement('a');
            a.href = track.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = `${track.title} (${track.trackLength})`;
            a.className = 'stretched-link text-decoration-none';

            const divLeft = document.createElement('div');
            divLeft.className = 'ms-2 me-auto';
            divLeft.appendChild(a);

            const small = document.createElement('small');
            small.className = 'badge bg-secondary rounded-pill';
            small.textContent = track.trackLength;

            li.appendChild(divLeft);
            li.appendChild(small);
            ol.appendChild(li);
        });
        modalTracklist.appendChild(ol);

        if (album.tracklist.length > 0) {
            modalPlayFirst.href = album.tracklist[0].url;
            modalPlayFirst.style.display = 'inline-block';
        } else {
            modalPlayFirst.style.display = 'none';
        }

        modal.show();
    }
});