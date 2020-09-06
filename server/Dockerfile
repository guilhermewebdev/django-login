FROM pypy:3

RUN pip install --upgrade pip; \
    useradd -Um app; \
    mkdir /home/app/.share; 

COPY . /home/app/.share/

RUN chmod -R 540 /home/app/.share/; \
    chown -R app:app /home/app/.share/; 

USER app

WORKDIR /home/app/.share


ENV PATH /home/app/.local/bin:$PATH

RUN pip install -r requirements.txt --user;