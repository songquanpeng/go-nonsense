let mainElement = undefined;
let loading = false;
let offset = 0;
let token = 'token';

function render(item, insertEnd = true) {
    let itemElement = `<div class="card item" id="item-${item.id}">
            <div class="card-content">
                <div class="content">
                    <p class="text">${item.content}</p>
                    <time>${item.time}</time>
                    <p class="id-tag">#${item.id}</p>
                </div>
            </div>
        </div>`;
    if (insertEnd) {
        mainElement.insertAdjacentHTML('beforeend', itemElement);
    } else {
        mainElement.insertAdjacentHTML('afterbegin', itemElement);
    }

}

function showModal(id) {
    document.getElementById(id).className = "modal is-active";
}

function closeModal(id) {
    document.getElementById(id).className = "modal";
}

async function onPostBtnClicked() {
    closeModal("newModal");
    let content = document.getElementById('editor').value;
    let res = await fetch(`/api/nonsense`, {
        method: 'POST',
        body: JSON.stringify({
            'content': content,
            'token': token
        })
    });
    let isDeletePost = content.startsWith('delete ');
    let deletePostId = undefined;
    if (isDeletePost) {
        let t = content.split(' ');
        deletePostId = t[t.length - 1];
    }
    let data = await res.json();
    let id = data.data;
    if (data.success) {
        closeModal("newModal");
        document.getElementById('editor').value = "";
        let res = await fetch(`/api/nonsense/${id}`);
        let data = await res.json();
        if (data.success) {
            if (isDeletePost) {
                document.getElementById(`item-${deletePostId}`).style.display = 'none';
            } else {
                render(data.data, false);
                offset += 1;
            }
        }
    } else {
        document.getElementById('newModalTitle').textContent = "发布失败！";
        console.error(data);
    }
}

async function loadData(start) {
    let res = await fetch(`/api/nonsense?p=${start}`);
    let data = await res.json()
    if (data.status) {
        return data.data;
    }
}

async function loadMore() {
    if (loading) return;
    loading = true;
    let items = await loadData(offset)
    offset += items.length;
    items.forEach((item) => {
        render(item);
    })
    loading = false;
}

async function main() {
    mainElement = document.getElementById('main');
    await loadMore();
    window.onscroll = async function () {
        if (shouldLoad()) {
            await loadMore();
        }
    }

}

function shouldLoad() {
    return (window.innerHeight + window.scrollY + 5) >= document.body.offsetHeight
}