FROM pypy:3

RUN pip install --upgrade pip; \
    useradd -rUm -u 999 app; 

WORKDIR /home/app/share

COPY . .

RUN chown -R app:app /home/app/share; \
    chmod -R 755 /home/app/share

ENV PATH /home/app/.local/bin:$PATH

USER app

RUN pip install -r requirements.txt --user;